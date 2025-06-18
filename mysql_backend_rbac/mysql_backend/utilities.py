import hashlib
import base64

def hash_string_to_50(input_str):
    """Compute SHA-256 hash and format to 50 characters (URL-safe Base64)."""
    digest = hashlib.sha256(input_str.encode('utf-8')).digest()
    b64 = base64.urlsafe_b64encode(digest).decode('utf-8').rstrip("=")
    return b64[:50].ljust(50, 'A')  # Truncate/pad to exactly 50 chars