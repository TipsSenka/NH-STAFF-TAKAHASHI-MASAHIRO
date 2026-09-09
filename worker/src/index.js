const MAX_NAME_LENGTH = 20;

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,OPTIONS",
  "access-control-allow-headers": "content-type",
};

function json(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      "cache-control": "no-store",
      ...CORS_HEADERS,
    },
  });
}

function validateName(name) {
  if (!name) {
    return { ok: false, message: "nameクエリを指定してください。" };
  }

  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { ok: false, message: "nameクエリが空です。" };
  }

  if (trimmed.length > MAX_NAME_LENGTH) {
    return { ok: false, message: `nameは${MAX_NAME_LENGTH}文字以内で指定してください。` };
  }

  const allowedPattern = /^[\p{L}\p{N}_\-\s]+$/u;
  if (!allowedPattern.test(trimmed)) {
    return {
      ok: false,
      message: "nameには日本語・英数字・空白・_・-のみ使用できます。",
    };
  }

  return { ok: true, value: trimmed };
}

function getGreetingByHour(hour) {
  if (hour < 5) return "遅い時間までおつかれさまです。";
  if (hour < 11) return "おはようございます。";
  if (hour < 18) return "こんにちは。";
  return "こんばんは。";
}

function getFortune() {
  const fortunes = ["大吉", "中吉", "小吉", "吉", "末吉"];
  const pick = fortunes[Math.floor(Math.random() * fortunes.length)];
  return {
    result: pick,
    comment: "今日も一歩ずつ前進していこう。",
  };
}

export default {
  async fetch(request) {
    try {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: CORS_HEADERS,
        });
      }

      if (request.method !== "GET") {
        return json(
          {
            error: "method_not_allowed",
            message: "このAPIはGETのみ対応しています。",
          },
          405,
        );
      }

      const url = new URL(request.url);
      const { pathname } = url;

      if (pathname === "/" || pathname === "/api") {
        return json({
          service: "Cloudflare Workers 日本語サンプルAPI",
          message: "利用可能なエンドポイントは /api/course /api/hello /api/fortune /api/events です。",
          endpoints: ["/api/course", "/api/hello?name=山田", "/api/fortune", "/api/events"],
        });
      }

      if (pathname === "/api/course") {
        return json({
          course: "Webアプリ開発基礎",
          message: "Cloudflare WorkersでJSONを返す練習用APIです。",
          updatedAt: new Date().toISOString(),
        });
      }

      if (pathname === "/api/hello") {
        const result = validateName(url.searchParams.get("name"));
        if (!result.ok) {
          return json(
            {
              error: "invalid_name",
              message: result.message,
            },
            400,
          );
        }

        const hour = new Date().getHours();
        return json({
          greeting: getGreetingByHour(hour),
          name: result.value,
          message: `${result.value}さん、学習を応援しています。`,
          hour,
        });
      }

      if (pathname === "/api/fortune") {
        return json({
          fortune: getFortune(),
          generatedAt: new Date().toISOString(),
        });
      }

      if (pathname === "/api/events") {
        return json({
          events: [
            { id: 1, title: "ガイダンス", date: "2026-10-01" },
            { id: 2, title: "ハンズオン", date: "2026-10-08" },
            { id: 3, title: "成果発表", date: "2026-10-22" },
          ],
        });
      }

      return json(
        {
          error: "not_found",
          message: "指定されたURLは存在しません。",
          path: pathname,
        },
        404,
      );
    } catch {
      return json(
        {
          error: "internal_server_error",
          message: "内部エラーが発生しました。時間をおいて再試行してください。",
        },
        500,
      );
    }
  },
};