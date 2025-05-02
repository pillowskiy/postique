import re

import torch
from app.config import settings
from sentence_transformers import SentenceTransformer


class TextEmbedding:
    def __init__(self):
        self.model = SentenceTransformer(settings.MODEL_NAME)

    def preprocess_text(self, text: str) -> str:
        text = re.sub(r"\s+", " ", text).strip()
        text = text.lower()
        return text

    def get_embedding(self, text: str) -> list[float]:
        processed_text = self.preprocess_text(text)
        if not processed_text:
            return [0.0] * settings.VECTOR_SIZE

        with torch.no_grad():
            embedding = self.model.encode(processed_text)

        return embedding.tolist()

    def get_combined_embedding(
        self, title: str, description: str, content: str
    ) -> list[float]:
        combined_text = f"{title} {title} {description} {content}"
        return self.get_embedding(combined_text)

    def get_similarity(self, embedding1: list[float], embedding2: list[float]) -> float:
        vec1 = torch.tensor(embedding1)
        vec2 = torch.tensor(embedding2)

        similarity = torch.nn.functional.cosine_similarity(
            vec1.unsqueeze(0), vec2.unsqueeze(0)
        )
        return similarity.item()
