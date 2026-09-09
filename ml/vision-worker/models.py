from pydantic import BaseModel
from typing import Optional

class ExtractedField(BaseModel):
    id: str
    field_name: str
    raw_text: Optional[str]
    normalised_value: Optional[float | str]
    confidence: float
    source_region_id: str
    extraction_model: str
