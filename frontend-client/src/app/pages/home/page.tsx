"use client";
import { IBackendRes } from "@/app/types/backend";
import { AuthService } from "../../apis/testApi";
import { useState, useEffect } from "react";
export default function Page() {
  const [data, setData] = useState<IBackendRes<any> | undefined>();
  useEffect(() => {
    const fetchData = async () => {
      const result = await AuthService.getHelloWorld();
      setData(result);
      console.log(result);
    };

    fetchData();
  }, []);
  return <p>{data ? JSON.stringify(data) : "Loading..."} bhuib</p>;
}
