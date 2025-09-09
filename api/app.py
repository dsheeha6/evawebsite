#!/usr/bin/env python3
"""
FastAPI Backend for Eva Sheehan Portfolio
Handles contact form submissions and email sending
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, validator
import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import logging
from typing import Optional
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Eva Sheehan Portfolio API",
    description="Backend API for Eva Sheehan's portfolio website",
    version="1.0.0"
)

# CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5000", 
        "http://127.0.0.1:5000",
        "http://127.0.0.1:3000",
        "https://evasheehan.com",
        "https://www.evasheehan.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# Contact form data model
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    organization: Optional[str] = None
    project_type: Optional[str] = None
    budget: Optional[str] = None
    timeline: Optional[str] = None
    message: str
    timestamp: Optional[str] = None
    user_agent: Optional[str] = None
    
    @validator('name')
    def name_must_be_valid(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('Name must be at least 2 characters long')
        if len(v.strip()) > 100:
            raise ValueError('Name must be less than 100 characters')
        return v.strip()
    
    @validator('message')
    def message_must_be_valid(cls, v):
        if len(v.strip()) < 10:
            raise ValueError('Message must be at least 10 characters long')
        if len(v.strip()) > 1000:
            raise ValueError('Message must be less than 1000 characters')
        return v.strip()

# Email configuration
EMAIL_CONFIG = {
    'smtp_server': os.getenv('SMTP_SERVER', 'smtp.gmail.com'),
    'smtp_port': int(os.getenv('SMTP_PORT', '587')),
    'smtp_username': os.getenv('SMTP_USERNAME', ''),
    'smtp_password': os.getenv('SMTP_PASSWORD', ''),
    'from_email': os.getenv('FROM_EMAIL', 'noreply@evasheehan.com'),
    'to_email': os.getenv('TO_EMAIL', 'hello@evasheehan.com'),
    'use_tls': os.getenv('USE_TLS', 'true').lower() == 'true'
}

def send_email(contact_data: ContactForm) -> bool:
    """
    Send email notification for contact form submission
    Returns True if email sent successfully, False otherwise
    """
    try:
        # Create message
        msg = MIMEMultipart()
        msg['From'] = EMAIL_CONFIG['from_email']
        msg['To'] = EMAIL_CONFIG['to_email']
        msg['Subject'] = f"New Contact Form Submission from {contact_data.name}"
        
        # Email body
        body = f"""
        New contact form submission received:
        
        Name: {contact_data.name}
        Email: {contact_data.email}
        Organization: {contact_data.organization or 'Not specified'}
        Project Type: {contact_data.project_type or 'Not specified'}
        Budget: {contact_data.budget or 'Not specified'}
        Timeline: {contact_data.timeline or 'Not specified'}
        
        Message:
        {contact_data.message}
        
        ---
        Submitted at: {contact_data.timestamp or datetime.now().isoformat()}
        User Agent: {contact_data.user_agent or 'Not available'}
        """
        
        msg.attach(MIMEText(body, 'plain'))
        
        # Send email
        if EMAIL_CONFIG['smtp_username'] and EMAIL_CONFIG['smtp_password']:
            # Use actual SMTP
            server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
            if EMAIL_CONFIG['use_tls']:
                server.starttls()
            server.login(EMAIL_CONFIG['smtp_username'], EMAIL_CONFIG['smtp_password'])
            server.send_message(msg)
            server.quit()
            logger.info(f"Email sent successfully to {EMAIL_CONFIG['to_email']}")
        else:
            # Log email content for development
            logger.info("Email would be sent in production:")
            logger.info(f"To: {EMAIL_CONFIG['to_email']}")
            logger.info(f"Subject: {msg['Subject']}")
            logger.info(f"Body: {body}")
        
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

def log_contact_submission(contact_data: ContactForm):
    """Log contact form submission for monitoring"""
    log_entry = {
        'timestamp': contact_data.timestamp or datetime.now().isoformat(),
        'name': contact_data.name,
        'email': contact_data.email,
        'organization': contact_data.organization,
        'project_type': contact_data.project_type,
        'budget': contact_data.budget,
        'timeline': contact_data.timeline,
        'message_length': len(contact_data.message),
        'user_agent': contact_data.user_agent
    }
    
    logger.info(f"Contact form submission: {json.dumps(log_entry, indent=2)}")

@app.get("/")
async def root():
    """Root endpoint - API status"""
    return {
        "message": "Eva Sheehan Portfolio API",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "contact": "/contact",
            "health": "/health"
        }
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "email_config": {
            "smtp_server": EMAIL_CONFIG['smtp_server'],
            "smtp_port": EMAIL_CONFIG['smtp_port'],
            "from_email": EMAIL_CONFIG['from_email'],
            "to_email": EMAIL_CONFIG['to_email'],
            "configured": bool(EMAIL_CONFIG['smtp_username'] and EMAIL_CONFIG['smtp_password'])
        }
    }

@app.post("/contact")
async def submit_contact(contact_data: ContactForm, request: Request):
    """
    Handle contact form submissions
    
    Args:
        contact_data: Validated contact form data
        request: FastAPI request object for additional context
    
    Returns:
        JSON response with success status
    """
    try:
        # Add timestamp if not provided
        if not contact_data.timestamp:
            contact_data.timestamp = datetime.now().isoformat()
        
        # Add user agent if not provided
        if not contact_data.user_agent:
            contact_data.user_agent = request.headers.get('user-agent', 'Not available')
        
        # Log the submission
        log_contact_submission(contact_data)
        
        # Send email notification
        email_sent = send_email(contact_data)
        
        # Return success response
        return JSONResponse(
            status_code=200,
            content={
                "ok": True,
                "message": "Contact form submitted successfully",
                "email_sent": email_sent,
                "timestamp": contact_data.timestamp
            }
        )
        
    except Exception as e:
        logger.error(f"Error processing contact form: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error while processing contact form"
        )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "ok": False,
            "error": exc.detail,
            "status_code": exc.status_code
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """General exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "ok": False,
            "error": "Internal server error",
            "status_code": 500
        }
    )

if __name__ == "__main__":
    import uvicorn
    
    # Development server configuration
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
