"use client";
import { AuthService } from "../../apis/testApi";
import { useState, useEffect } from "react";
export default function Page() {
  const [data, setData] = useState<string | undefined>(undefined);
  useEffect(() => {
    const fetchData = async () => {
      const result = await AuthService.getHelloWorld();
      setData(result.data);
    };

    fetchData();
  }, []);
  return <p>{data} bhuib</p>;
}
