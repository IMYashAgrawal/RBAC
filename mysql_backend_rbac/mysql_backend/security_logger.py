# security_logger.py
import logging
from logging.handlers import RotatingFileHandler
import json
from flask import request
import time

def configure_logging(app):
    handler = RotatingFileHandler(
        'security_events.log',
        maxBytes=1024 * 1024 * 10,  # 10MB
        backupCount=5
    )
    formatter = StructuredFormatter()
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    app.logger.setLevel(logging.INFO)

class StructuredFormatter(logging.Formatter):
    def format(self, record):
        log_data = {
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S%z'),
            'level': record.levelname,
            'event_type': getattr(record, 'event_type', 'SYSTEM'),
            'user': getattr(record, 'user', 'anonymous'),
            'ip_address': getattr(record, 'ip_address', 'unknown'),
            'details': record.getMessage()
        }
        return json.dumps(log_data)