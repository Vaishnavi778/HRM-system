from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import date

import models, schemas
from database import engine, SessionLocal

from fastapi.middleware.cors import CORSMiddleware

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# DB Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ---------------- EMPLOYEES ----------------

@app.post("/employees")
def add_employee(emp: schemas.EmployeeCreate,
                 db: Session = Depends(get_db)):

    existing = db.query(models.Employee).filter(
        (models.Employee.employee_id == emp.employee_id) |
        (models.Employee.email == emp.email)
    ).first()

    if existing:
        raise HTTPException(400, "Employee already exists")

    new_emp = models.Employee(**emp.dict())
    db.add(new_emp)
    db.commit()

    return {"message": "Employee added"}


@app.get("/employees")
def get_employees(db: Session = Depends(get_db)):
    return db.query(models.Employee).all()


@app.delete("/employees/{employee_id}")
def delete_employee(employee_id: str,
                    db: Session = Depends(get_db)):

    emp = db.query(models.Employee).filter(
        models.Employee.employee_id == employee_id
    ).first()

    if not emp:
        raise HTTPException(404, "Employee not found")

    db.delete(emp)
    db.commit()

    return {"message": "Deleted"}


# ---------------- ATTENDANCE ----------------

@app.post("/attendance")
def mark_attendance(att: schemas.AttendanceCreate,
                    db: Session = Depends(get_db)):

    record = models.Attendance(**att.dict())
    db.add(record)
    db.commit()

    return {"message": "Attendance marked"}


@app.get("/attendance/{employee_id}")
def get_attendance(employee_id: str,
                   db: Session = Depends(get_db)):

    return db.query(models.Attendance).filter(
        models.Attendance.employee_id == employee_id
    ).all()


# ---------------- DASHBOARD STATS ----------------

@app.get("/stats/employees")
def total_employees(db: Session = Depends(get_db)):

    count = db.query(models.Employee).count()
    return {"total_employees": count}


@app.get("/stats/present-today")
def present_today(db: Session = Depends(get_db)):

    today = date.today()

    count = db.query(models.Attendance).filter(
        models.Attendance.date == today,
        models.Attendance.status == "Present"
    ).count()

    return {"present_today": count}
