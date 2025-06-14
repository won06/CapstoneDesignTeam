import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re
import json
import sys
from konlpy.tag import Okt
from collections import Counter

class KeywordBasedRecommender:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(
            max_features=1000,
            stop_words=['을', '를', '이', '가', '은', '는', '에', '의', '로', '와', '과', '도', '만', '에서', '으로', '에게', '뿐', '의', '가', '이', '은', '들', '는', '좀', '잘', '걍', '과', '도', '를', '으로', '자', '에', '와', '한', '하다']
        )
        self.okt = Okt()
        self.course_keywords = {}
        self.career_keywords = {}
        self.course_data = {}
        self.career_data = {}
        
    def preprocess_text(self, text):
        # 한글, 영문, 숫자만 남기고 제거
        text = re.sub(r'[^\w\s가-힣]', ' ', text)
        # 형태소 분석
        words = self.okt.morphs(text, stem=True)
        return ' '.join(words)
    
    def extract_keywords(self, text, top_n=10):
        # 텍스트 전처리
        processed_text = self.preprocess_text(text)
        # 형태소 분석
        words = self.okt.morphs(processed_text)
        # 명사 추출
        nouns = self.okt.nouns(processed_text)
        # 단어 빈도수 계산
        word_count = Counter(words + nouns)
        # 상위 키워드 반환
        return [word for word, count in word_count.most_common(top_n)]
    
    def load_data(self, courses_data, careers_data):
        # 과목 데이터 처리
        for course in courses_data:
            course_text = f"{course['title']} {course['description']}"
            self.course_keywords[course['course_id']] = self.extract_keywords(course_text)
            self.course_data[course['course_id']] = course
        
        # 직업 데이터 처리
        for career in careers_data:
            career_text = f"{career['job_name']} {career['summary']}"
            self.career_keywords[career['career_id']] = self.extract_keywords(career_text)
            self.career_data[career['career_id']] = career
    
    def calculate_similarity(self, keywords1, keywords2):
        # 키워드 간 유사도 계산 (Jaccard 유사도)
        common_keywords = set(keywords1) & set(keywords2)
        if not common_keywords:
            return 0
        return len(common_keywords) / (len(keywords1) + len(keywords2) - len(common_keywords))
    
    def get_career_recommendations(self, course_id, top_n=5):
        """과목 기반 직업 추천"""
        if course_id not in self.course_keywords:
            return []
        
        course_keywords = self.course_keywords[course_id]
        
        # 모든 직업과의 유사도 계산
        similarities = []
        for career_id, career_keywords in self.career_keywords.items():
            similarity = self.calculate_similarity(course_keywords, career_keywords)
            if similarity > 0:
                similarities.append((career_id, similarity))
        
        # 유사도 기준으로 정렬
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # 상위 N개 직업 반환
        return [career_id for career_id, _ in similarities[:top_n]]
    
    def get_course_recommendations(self, career_id, top_n=5):
        """직업 기반 과목 추천"""
        if career_id not in self.career_keywords:
            return []
        
        career_keywords = self.career_keywords[career_id]
        
        # 모든 과목과의 유사도 계산
        similarities = []
        for course_id, course_keywords in self.course_keywords.items():
            similarity = self.calculate_similarity(career_keywords, course_keywords)
            if similarity > 0:
                similarities.append((course_id, similarity))
        
        # 유사도 기준으로 정렬
        similarities.sort(key=lambda x: x[1], reverse=True)
        
        # 상위 N개 과목 반환
        return [course_id for course_id, _ in similarities[:top_n]]
    
    def get_keywords(self, item_id, is_course=True):
        """특정 과목 또는 직업의 키워드 반환"""
        if is_course:
            return self.course_keywords.get(item_id, [])
        return self.career_keywords.get(item_id, [])

def main():
    # 입력 데이터 파싱 (파일 경로에서 읽기)
    with open(sys.argv[1], 'r', encoding='utf-8') as f:
        input_data = json.load(f)
    courses_data = input_data['courses']
    careers_data = input_data['careers']
    target_id = input_data['target_id']
    mode = input_data['mode']  # 'course_to_career' 또는 'career_to_course'
    
    # 추천 시스템 초기화 및 실행
    recommender = KeywordBasedRecommender()
    recommender.load_data(courses_data, careers_data)
    
    if mode == 'course_to_career':
        recommendations = recommender.get_career_recommendations(target_id)
    else:  # career_to_course
        recommendations = recommender.get_course_recommendations(target_id)
    
    # 키워드 정보도 함께 반환
    keywords = recommender.get_keywords(target_id, mode == 'career_to_course')
    
    result = {
        'recommendations': recommendations,
        'keywords': keywords
    }
    
    # 결과 출력
    print(json.dumps(result))

if __name__ == "__main__":
    main() 