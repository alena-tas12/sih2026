import argparse
import json
import sys
from typing import List
from models import ExtractedField

class DualModalPipeline:
    def __init__(self):
        pass

    def run_ocr(self, image_path: str) -> List[ExtractedField]:
        # Simulated OCR output
        return [
            ExtractedField(
                id="ev_ocr_1",
                field_name="net_quantity",
                raw_text="NET QUANTITY: 500 q",
                normalised_value=None,
                confidence=0.85,
                source_region_id="region_001",
                extraction_model="OCR_PRIMARY"
            )
        ]

    def run_vlm(self, image_path: str) -> List[ExtractedField]:
        # Simulated Vision-Language Model output
        return [
            ExtractedField(
                id="ev_vlm_1",
                field_name="net_quantity",
                raw_text=None,
                normalised_value=500.0,
                confidence=0.92,
                source_region_id="region_001",
                extraction_model="VISION_LANGUAGE_SECONDARY"
            )
        ]

    def process_image(self, image_path: str) -> List[ExtractedField]:
        return self.run_ocr(image_path) + self.run_vlm(image_path)

def main():
    parser = argparse.ArgumentParser(description="Extract compliance fields from packaging images.")
    parser.add_argument("--image", required=True, help="Path to the package image")
    args = parser.parse_args()

    pipeline = DualModalPipeline()
    try:
        evidence = pipeline.process_image(args.image)
        print(json.dumps([e.model_dump() for e in evidence]))
        sys.exit(0)
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
