# Backend coding guidelines

1. FastAPI route handlers stay thin: load input, call a service, serialize a response.
2. Business rules live in `backend/app/services/` and must be testable without FastAPI, HTTP, or a database session.
3. New behavior requires focused automated tests.
4. API responses use declared Pydantic response models; do not return ad-hoc dictionaries.
5. Run the configured lint and test commands before requesting review.
