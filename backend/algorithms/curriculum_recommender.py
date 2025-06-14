import numpy as np
from sklearn.neighbors import NearestNeighbors
import json
import sys

class CurriculumRecommender:
    def __init__(self):
        self.courses = []
        self.course_ids = []
        
    def load_data(self, courses_data):
        self.courses = []
        self.course_ids = []
        
        for course in courses_data:
            features = [
                course['recommend_year'],  # 추천 학년
                course['is_required'],     # 필수 과목 여부
                course['credit'],          # 학점
                1 if course['recommend_year'] <= 2 else 0,  # 저학년 과목 여부
                1 if course['recommend_year'] >= 3 else 0   # 고학년 과목 여부
            ]
            self.courses.append(features)
            self.course_ids.append(course['course_id'])
            
        self.courses = np.array(self.courses)
        
    def get_recommendations(self, user_grade, completed_courses=None):
        if completed_courses is None:
            completed_courses = []
            
        # 가중치 설정 (학년, 필수과목, 학점, 저학년, 고학년)
        weights = np.array([1.0, 1.5, 0.5, 0.8, 0.6])
        
        # KNN 모델 학습
        n_neighbors = min(5, len(self.courses))
        knn = NearestNeighbors(n_neighbors=n_neighbors, metric='euclidean')
        knn.fit(self.courses * weights)
        
        # 이미 수강한 과목만 제외하고 모든 과목을 대상으로 함
        valid_courses = []
        valid_course_ids = []
        
        for i, course in enumerate(self.courses):
            course_id = self.course_ids[i]
            if course_id not in completed_courses:
                valid_courses.append(course)
                valid_course_ids.append(course_id)
        
        if not valid_courses:
            return []
            
        valid_courses = np.array(valid_courses)
        
        # 사용자 프로필 생성 (학년 제한 없이)
        user_profile = np.array([
            user_grade,      # 현재 학년
            1,              # 필수과목 선호
            3,              # 평균 학점
            1 if user_grade <= 2 else 0,  # 저학년 여부
            1 if user_grade >= 3 else 0   # 고학년 여부
        ])
        
        # 가장 가까운 과목 찾기
        distances, indices = knn.kneighbors([user_profile * weights])
        
        # 추천 과목 ID 반환 (모든 유효한 과목 추천)
        return valid_course_ids

def main():
    # 입력 데이터 파싱
    input_data = json.loads(sys.argv[1])
    courses_data = input_data['courses']
    user_grade = input_data['user_grade']
    completed_courses = input_data.get('completed_courses', [])
    
    # 추천 시스템 초기화 및 실행
    recommender = CurriculumRecommender()
    recommender.load_data(courses_data)
    recommendations = recommender.get_recommendations(user_grade, completed_courses)
    
    # 결과 출력
    print(json.dumps(recommendations))

if __name__ == "__main__":
    main() 