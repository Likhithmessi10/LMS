"""Auth router — login endpoint"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from auth.jwt import create_access_token, hash_password, verify_password

router = APIRouter()

# Hardcoded seed admin for demo — replace with DB lookup in production
SEED_USERS = {
    "admin@aptransco.com": {
        "id": "U001", "name": "Admin", "role": "ADMIN",
        "password_hash": hash_password("admin123"),
    },
    "employee@aptransco.com": {
        "id": "U002", "name": "John Doe", "role": "EMPLOYEE",
        "password_hash": hash_password("employee123"),
    },
    "intern@aptransco.com": {
        "id": "U003", "name": "Rahul Sharma", "role": "INTERN",
        "password_hash": hash_password("intern123"),
    },
}


class LoginResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    role:         str
    name:         str
    user_id:      str


@router.post("/login", response_model=LoginResponse)
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = SEED_USERS.get(form.username)
    if not user or not verify_password(form.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({
        "sub":  user["id"],
        "role": user["role"],
        "name": user["name"],
        "email": form.username,
    })
    return LoginResponse(
        access_token=token,
        role=user["role"],
        name=user["name"],
        user_id=user["id"],
    )
