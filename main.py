from fastapi import FastAPI, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from database import SessionLocal, engine
from models import Base, Product as ProductModel, User
from jose import jwt
from datetime import datetime, timedelta
import os
from fastapi import Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles


app = FastAPI()


templates = Jinja2Templates(directory="templates")

app.mount("/static", StaticFiles(directory="static"), name="static")


# ----------------------------
# HTML Pages
# ----------------------------
@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html"
    )
@app.get("/login-page", response_class=HTMLResponse)
async def login_page(request: Request):
    return templates.TemplateResponse(
        "login.html",
        {"request": request}
    )


@app.get("/signup-page", response_class=HTMLResponse)
async def signup_page(request: Request):
    return templates.TemplateResponse(
        "signup.html",
        {"request": request}
    )


@app.get("/shop", response_class=HTMLResponse)
async def shop_page(request: Request):
    return templates.TemplateResponse(
        "shopwave.html",
        {"request": request}
    )


# Create tables
Base.metadata.create_all(bind=engine)

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

SECRET_KEY = os.getenv("SECRET_KEY", "mysecretkey123")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# ----------------------------
# Database Dependency
# ----------------------------

# -----------------------------
# Database Dependency
# -----------------------------
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


def create_access_token(data: dict):

    to_encode = data.copy()

    expire = datetime.utcnow() + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

# -----------------------------
# Pydantic Schema
# -----------------------------



class ProductCreate(BaseModel):
    name: str
    price: float
    category: str


class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class LoginUser(BaseModel):
     username: str
     password: str



# -----------------------------
# Home Route
# -----------------------------
# -----------------------------
# Home Route
# -----------------------------
@app.get("/", response_class=HTMLResponse)
async def home():
    return "<h1>Home Page Works</h1>"
# -----------------------------
# Get All Products
# -----------------------------
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = pwd_context.hash(user.password)

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User Registered Successfully",
        "username": new_user.username
    }
@app.post("/login")
def login(user: LoginUser, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(
        User.username == user.username
    ).first()

    if not db_user:
        return {"message": "User not found"}

    if not pwd_context.verify(
        user.password,
        db_user.password
    ):
        return {"message": "Invalid Password"}

    access_token = create_access_token(
        data={"sub": db_user.username}
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# -----------------------------
# Create Product
# -----------------------------
@app.post("/products")
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    new_product = ProductModel(
        name=product.name,
        price=product.price,
        category=product.category
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# -----------------------------
# Update Product
# -----------------------------
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    product: ProductCreate,
    db: Session = Depends(get_db)
):
    db_product = db.query(ProductModel).filter(
        ProductModel.id == product_id
    ).first()

    if not db_product:
        return {"message": "Product Not Found"}

    db_product.name = product.name
    db_product.price = product.price
    db_product.category = product.category

    db.commit()
    db.refresh(db_product)

    return db_product


# -----------------------------
# Delete Product
# -----------------------------
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    db_product = db.query(ProductModel).filter(
        ProductModel.id == product_id
    ).first()

    if not db_product:
        return {"message": "Product Not Found"}

    db.delete(db_product)
    db.commit()

    return {"message": "Product Deleted Successfully"}