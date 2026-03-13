"""
Open edX REST API integration service.
All calls use OAuth2 client credentials for authentication.
Falls back gracefully if edX is not reachable.
"""
import os
import httpx
from dotenv import load_dotenv

load_dotenv()

EDX_BASE      = os.getenv("OPENEDX_BASE_URL",      "http://localhost:18000")
EDX_CLIENT_ID = os.getenv("OPENEDX_CLIENT_ID",     "lms-key")
EDX_CLIENT_SEC= os.getenv("OPENEDX_CLIENT_SECRET", "lms-secret")


class OpenEdXService:
    def __init__(self):
        self._token: str | None = None

    async def _get_token(self) -> str:
        """Obtain OAuth2 client_credentials token from Open edX."""
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                f"{EDX_BASE}/oauth2/access_token",
                data={
                    "grant_type":    "client_credentials",
                    "client_id":     EDX_CLIENT_ID,
                    "client_secret": EDX_CLIENT_SEC,
                    "token_type":    "jwt",
                },
            )
            resp.raise_for_status()
            self._token = resp.json()["access_token"]
        return self._token

    def _auth_headers(self) -> dict:
        return {"Authorization": f"JWT {self._token}"} if self._token else {}

    async def get_courses(self) -> list:
        """GET /api/courses/v1/courses/"""
        await self._get_token()
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{EDX_BASE}/api/courses/v1/courses/",
                headers=self._auth_headers(),
                params={"page_size": 50},
            )
            resp.raise_for_status()
            data = resp.json()
            return [
                {
                    "id":          c["id"],
                    "title":       c["name"],
                    "category":    c.get("org", "General"),
                    "description": c.get("short_description", ""),
                    "thumbnail":   c.get("media", {}).get("image", {}).get("raw", ""),
                    "duration":    "Self-paced",
                }
                for c in data.get("results", [])
            ]

    async def enroll_user(self, username: str, course_id: str) -> dict:
        """POST /api/enrollment/v1/enrollment"""
        await self._get_token()
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                f"{EDX_BASE}/api/enrollment/v1/enrollment",
                headers=self._auth_headers(),
                json={"user": username, "course_details": {"course_id": course_id}},
            )
            resp.raise_for_status()
            return resp.json()

    async def get_progress(self, username: str, course_id: str) -> dict:
        """GET /api/course_home/v1/progress/{course_id}"""
        await self._get_token()
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{EDX_BASE}/api/course_home/v1/progress/{course_id}",
                headers=self._auth_headers(),
                params={"username": username},
            )
            resp.raise_for_status()
            return resp.json()

    async def get_grades(self, username: str, course_id: str) -> dict:
        """GET /api/grades/v1/courses/{course_id}/?username=..."""
        await self._get_token()
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{EDX_BASE}/api/grades/v1/courses/{course_id}/",
                headers=self._auth_headers(),
                params={"username": username},
            )
            resp.raise_for_status()
            return resp.json()

    async def get_certificates(self, username: str) -> list:
        """GET /api/certificates/v0/certificates/{username}"""
        await self._get_token()
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.get(
                f"{EDX_BASE}/api/certificates/v0/certificates/{username}",
                headers=self._auth_headers(),
            )
            resp.raise_for_status()
            return resp.json().get("results", [])


# Singleton instance
edx_service = OpenEdXService()
