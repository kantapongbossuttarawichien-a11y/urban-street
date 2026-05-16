import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { url, method, body } = await request.json();
    console.log(`Proxy POST to: ${url}`);

    const response = await fetch(url, {
      method: method || "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      redirect: "follow", // ให้เดินตาม Redirect ของ Google Script ไปจนสุด
    });

    if (response.status === 404) {
      return NextResponse.json(
        { error: "Google Script returned 404. Please check your Web App URL and Deployment status." },
        { status: 404 }
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      console.error("Proxy POST: GAS returned non-JSON response:", text.substring(0, 500));
      return NextResponse.json(
        {
          error: "Google Script returned non-JSON response.",
          details: text.substring(0, 500),
        },
        { status: 502 }
      );
    }
  } catch (error: unknown) {
    console.error("Proxy POST Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to connect to GAS", details: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  
  if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

  console.log(`Proxy GET to: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    });

    if (response.status === 404) {
      return NextResponse.json({ error: "Google Script returned 404. Please check your Web App URL and Deployment status." }, { status: 404 });
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const text = await response.text();
      return NextResponse.json({ 
        error: "Google Script returned non-JSON response.", 
        details: text.substring(0, 500) // ส่ง 500 ตัวอักษรแรกไปดูเพื่อประหยัด bandwidth
      }, { status: 500 });
    }
  } catch (error: unknown) {
    console.error("Proxy GET Error:", error);
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to connect to GAS", details: message }, { status: 500 });
  }
}
