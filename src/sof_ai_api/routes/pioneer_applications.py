"""Pioneer Applications — in-memory store (MVP).

Supports creating applications, listing approved ones, and fetching by slug.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/pioneer-applications", tags=["pioneer-applications"])

# ---------------------------------------------------------------------------
# In-memory store
# ---------------------------------------------------------------------------
_store: list[dict] = []
_next_id: int = 1


# ---------------------------------------------------------------------------
# Request / response schemas
# ---------------------------------------------------------------------------
class CreateApplicationRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: str = Field(..., min_length=3, max_length=300)
    slug: str = Field(..., min_length=1, max_length=120)


class ApplicationResponse(BaseModel):
    id: int
    name: str
    email: str
    slug: str
    status: str


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@router.post("/", response_model=ApplicationResponse)
def create_application(payload: CreateApplicationRequest) -> ApplicationResponse:
    global _next_id
    record = {
        "id": _next_id,
        "name": payload.name,
        "email": payload.email,
        "slug": payload.slug,
        "status": "pending",
    }
    _next_id += 1
    _store.append(record)
    return ApplicationResponse(**record)


@router.get("/approved", response_model=list[ApplicationResponse])
def list_approved(limit: int = 50) -> list[ApplicationResponse]:
    return [
        ApplicationResponse(**r) for r in _store if r["status"] == "approved"
    ][:limit]


@router.post("/{id}/approve", response_model=ApplicationResponse)
def approve_application(id: int) -> ApplicationResponse:
    for r in _store:
        if r["id"] == id:
            r["status"] = "approved"
            return ApplicationResponse(**r)
    raise HTTPException(status_code=404, detail="Application not found")


@router.get("/by-slug/{slug}", response_model=ApplicationResponse)
def get_by_slug(slug: str) -> ApplicationResponse:
    for r in _store:
        if r["slug"] == slug:
            return ApplicationResponse(**r)
    raise HTTPException(status_code=404, detail="Application not found")
