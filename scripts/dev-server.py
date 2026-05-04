#!/usr/bin/env python3
"""
로컬 dev 서버 — vercel.json의 rewrites를 그대로 적용해
/preview, /admin, /renew 같은 clean URL이 로컬에서도 동작하게 한다.

사용:
  python3 scripts/dev-server.py [port]   (default 8765)
"""
import http.server
import json
import os
import sys
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

with open(os.path.join(ROOT, 'vercel.json'), 'r', encoding='utf-8') as f:
    config = json.load(f)
REWRITES = {r['source']: r['destination'] for r in config.get('rewrites', [])}

class RewriteHandler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        url = urlparse(path)
        if url.path in REWRITES:
            new_path = REWRITES[url.path]
            if url.query:
                new_path += '?' + url.query
            return super().translate_path(new_path)
        return super().translate_path(path)

    def do_GET(self):
        url = urlparse(self.path)
        if url.path in REWRITES:
            self.path = REWRITES[url.path] + (('?' + url.query) if url.query else '')
        return super().do_GET()

    def log_message(self, fmt, *args):
        # 더 깔끔한 로그
        sys.stderr.write(f"  {self.command} {self.path} -> {args[1] if len(args)>=2 else ''}\n")

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    print(f"브리픽 dev 서버")
    print(f"  http://127.0.0.1:{port}/             메인")
    print(f"  http://127.0.0.1:{port}/preview      차세대 미리보기")
    print(f"  http://127.0.0.1:{port}/admin        운영 대시보드")
    print(f"  http://127.0.0.1:{port}/renew        재구독")
    print(f"  http://127.0.0.1:{port}/help         수신 문제 해결")
    print(f"  http://127.0.0.1:{port}/terms        이용약관")
    print(f"  http://127.0.0.1:{port}/privacy      개인정보처리방침")
    print(f"  http://127.0.0.1:{port}/refund       환불정책")
    print(f"  Ctrl+C 종료")
    print()
    server = http.server.HTTPServer(('127.0.0.1', port), RewriteHandler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n서버 종료")
