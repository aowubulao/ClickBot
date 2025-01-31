import React, { useEffect, useState } from "react";
import { Button, Input, message, Popconfirm, Switch } from "antd";
import { LineInfo } from "./Interfaces.tsx";
import { invoke } from "@tauri-apps/api/core";
import { useTranslation } from "react-i18next";

interface IProps {
  lineInfo: LineInfo;
  setLineInfo: (info: LineInfo) => Promise<void>;
  delLine: (id: string) => Promise<void>;
}

const Index: React.FC<IProps> = (props) => {
  const { lineInfo, setLineInfo, delLine } = props;

  const [supportKeys, setSupportKey] = useState<Set<String>>(new Set());
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useTranslation();

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
      message.error(t("InputLine.NotSupportKey") + key);
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
          {t("InputLine.Enable")}：
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
          {t("InputLine.Key")}：
          <Input
            style={{ width: 150 }}
            value={pressedKey}
            onKeyDown={handleKeyDown}
            readOnly
          />
        </span>
        <span style={{ marginLeft: 20 }}>
          {t("InputLine.Interval")}：
          <Input
            style={{ width: 120 }}
            value={interval}
            type={"number"}
            onChange={(e: any) => {
              const itv = Math.floor(e.target.value);
              if (itv <= 0) {
                message.error(t("InputLine.Interval_Error"));
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
            title={t("InputLine.Delete.Confirm.Msg")}
            onConfirm={() => delLine(lineInfo.id)}
            okText={t("InputLine.Delete.Confirm.Confirm")}
            cancelText={t("InputLine.Delete.Confirm.Cancel")}
          >
            <Button type="primary" danger ghost>
              {t("InputLine.Delete")}
            </Button>
          </Popconfirm>
        </span>
      </div>
    </>
  );
};

export default Index;
