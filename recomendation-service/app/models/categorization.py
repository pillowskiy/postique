import logging
import os
import pickle
import re
from typing import List

import joblib
import numpy as np
from app.config import settings
from app.models.embedding import TextEmbedding


class CategoryClassifier:
    def __init__(self):
        self.model_path = f"models/{settings.CATEGORY_MODEL_NAME}"
        self.embedding_model = TextEmbedding()

        try:
            self.categories = self._load_categories()
            self.model = self._load_model()
            logging.info("Category model loaded successfully")
        except Exception as e:
            logging.error(f"Error loading category model: {e}")
            self.categories = self._get_default_categories()
            self.model = None

    def _load_model(self):
        try:
            if os.path.exists(f"{self.model_path}/model.pkl"):
                return joblib.load(f"{self.model_path}/model.pkl")
            return None
        except Exception as e:
            logging.error(f"Failed to load model: {e}")
            return None

    def _load_categories(self):
        try:
            if os.path.exists(f"{self.model_path}/categories.pkl"):
                with open(f"{self.model_path}/categories.pkl", "rb") as f:
                    return pickle.load(f)
            return self._get_default_categories()
        except Exception as e:
            logging.error(f"Failed to load categories: {e}")
            return self._get_default_categories()

    def _get_default_categories(self):
        return [
            "Новини",
            "Спорт",
            "Технології",
            "Культура",
            "Політика",
            "Економіка",
            "Здоров'я",
            "Освіта",
            "Розваги",
            "Інше",
        ]

    def _preprocess_text(self, title: str, description: str, content: str) -> str:
        combined_text = f"{title} {title} {description} {content[:1000]}"
        combined_text = re.sub(r"\s+", " ", combined_text).strip().lower()
        return combined_text

    def _extract_features(
        self, title: str, description: str, content: str
    ) -> np.ndarray:
        text = self._preprocess_text(title, description, content)
        return np.array(self.embedding_model.get_embedding(text)).reshape(1, -1)

    def _rule_based_classification(self, title: str, description: str) -> List[str]:
        text = f"{title.lower()} {description.lower()}"

        category_keywords = {
            "Новини": ["новини", "сьогодні", "подія", "відбулося"],
            "Спорт": ["спорт", "футбол", "змагання", "чемпіонат", "медаль"],
            "Технології": [
                "технології",
                "інновації",
                "гаджет",
                "комп'ютер",
                "штучний інтелект",
            ],
            "Культура": ["культура", "мистецтво", "фільм", "музика", "вистава"],
            "Політика": ["політика", "уряд", "президент", "парламент", "закон"],
            "Економіка": ["економіка", "бізнес", "фінанси", "ринок", "валюта"],
            "Здоров'я": ["здоров'я", "медицина", "ліки", "хвороба", "лікування"],
            "Освіта": ["освіта", "університет", "школа", "навчання", "знання"],
            "Розваги": ["розваги", "шоу", "зірка", "знаменитість", "кіно"],
        }

        categories = []
        for category, keywords in category_keywords.items():
            for keyword in keywords:
                if keyword in text:
                    categories.append(category)
                    break

        if not categories:
            categories = ["Інше"]

        return categories[:3]

    def predict_categories(
        self, title: str, description: str, content: str
    ) -> List[str]:
        try:
            if self.model is None:
                return self._rule_based_classification(title, description)

            features = self._extract_features(title, description, content)
            prediction = self.model.predict_proba(features)

            top_indices = np.argsort(prediction[0])[-3:][::-1]
            threshold = 0.1

            categories = []
            for idx in top_indices:
                if prediction[0][idx] >= threshold:
                    categories.append(self.categories[idx])

            if not categories:
                categories = self._rule_based_classification(title, description)

            return categories

        except Exception as e:
            logging.error(f"Error predicting categories: {e}")
            return self._rule_based_classification(title, description)
