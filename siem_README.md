# SIEM Integration Guide

The application now generates structured security logs in JSON format at `security_events.log`.

Sample log entry:
```json
{
    "timestamp": "2023-10-05 14:30:45+0000",
    "level": "INFO",
    "event_type": "AUTHENTICATION",
    "user": "john_doe",
    "ip_address": "192.168.1.100",
    "details": "Login success"
}