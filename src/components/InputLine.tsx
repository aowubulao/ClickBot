import React, { useEffect, useState } from "react";
import { Button, Input, message, Popconfirm, Switch } from "antd";
import { LineInfo } from "./Interfaces.tsx";
import { invoke } from "@tauri-apps/api/core";

interface IProps {
  lineInfo: LineInfo;
  setLineInfo: (info: LineInfo) => Promise<void>;
  delLine: (id: string) => Promise<void>;
}

const Index: React.FC<IProps> = (props) => {
  const { lineInfo, setLineInfo, delLine } = props;

  const [supportKeys, setSupportKey] = useState<Set<String>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setPressedKey(lineInfo.key);
    setEnable(lineInfo.enable);
    setInterval(lineInfo.interval);
    initKeys().then(() => setLoading(false));
  }, []);

  const initKeys = async () => {
    const list = await invoke("support_key_list");
    if (list && Array.isArray(list)) {
      setSupportKey(new Set(list));
    }
  };

  const [pressedKey, setPressedKey] = useState<string>("");
  const [enable, setEnable] = useState<boolean>(false);
  const [interval, setInterval] = useState<number>(100);

  const handleKeyDown = (event: any) => {
    const key = event.key.toUpperCase();
    console.log(key);
    if (!supportKeys.has(key)) {
      message.error("不支持的按键!");
      return;
    }
    setPressedKey(key);
    lineInfo.key = key;
    handleInfoChange(lineInfo);
  };

  const handleInfoChange = (lineInfo: LineInfo) => {
    setLineInfo(lineInfo);
  };

  return (
    <>
      <div style={loading ? { display: "none" } : { display: "block" }}>
        <span>
          启用：
          <Switch
            value={enable}
            onChange={(e: boolean) => {
              setEnable(e);
              lineInfo.enable = e;
              handleInfoChange(lineInfo);
            }}
          />
        </span>
        <span style={{ marginLeft: 20 }}>
          按键：
          <Input
            style={{ width: 150 }}
            value={pressedKey}
            onKeyDown={handleKeyDown}
            readOnly
          />
        </span>
        <span style={{ marginLeft: 20 }}>
          间隔(ms)：
          <Input
            style={{ width: 120 }}
            value={interval}
            type={"number"}
            onChange={(e: any) => {
              const itv = Math.floor(e.target.value);
              if (itv <= 0) {
                message.error("间隔不能为0!");
              } else {
                setInterval(itv);
              }
              lineInfo.interval = itv;
              handleInfoChange(lineInfo);
            }}
          />
        </span>
        <span style={{ marginLeft: 20 }}>
          <Popconfirm
            placement="right"
            title={"确认删除吗"}
            onConfirm={() => delLine(lineInfo.id)}
            okText="是"
            cancelText="否"
          >
            <Button type="primary" danger ghost>
              删除
            </Button>
          </Popconfirm>
        </span>
      </div>
    </>
  );
};

export default Index;
