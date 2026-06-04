# Briefick Terminal — 단독 실행 컨테이너 (정적 + Yahoo 시세 프록시).
# 의존성 0 (Node 내장 모듈만) — npm install 단계 없음.
FROM node:20-alpine
WORKDIR /app
COPY . /app
ENV PORT=8080
EXPOSE 8080
# 헬스체크: 프록시 health 엔드포인트
HEALTHCHECK --interval=30s --timeout=4s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1
CMD ["node", "server/server.js"]
