import React, { useEffect, useState } from "react";
import { load } from "@tauri-apps/plugin-store";
import { LineInfo } from "./Interfaces.tsx";
import InputLine from "./inputLine.tsx";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

interface IProps {}

const Index: React.FC<IProps> = () => {
  const [lineMap, setLineMap] = useState<Map<string, LineInfo>>(
    new Map<string, LineInfo>()
  );
  const { t } = useTranslation();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    const store = await load("store.json", { autoSave: false });
    const storeLineList = await store.get<LineInfo[]>("cb.line_list");
    if (storeLineList) {
      const newLineMap = new Map(lineMap);
      for (let line of storeLineList) {
        newLineMap.set(line.id, line);
      }
      setLineMap(newLineMap);
    } else {
      await addLine();
    }
  };

  const addLine = async () => {
    const id = Date.now().toString();
    const info: LineInfo = {
      id,
      key: "ENTER",
      interval: 1000,
      enable: false,
      type: 1,
    };
    const newLineMap = new Map(lineMap);
    newLineMap.set(id, info);
    setLineMap(newLineMap);
    await save2Store(newLineMap);
  };

  const setLineInfo = async (info: LineInfo) => {
    const newLineMap = new Map(lineMap);
    newLineMap.set(info.id, info);
    setLineMap(newLineMap);
    setLineMap(lineMap);
    await save2Store(newLineMap);
  };

  const delLine = async (id: string) => {
    const newLineMap = new Map(lineMap);
    newLineMap.delete(id);
    setLineMap(newLineMap);
    await save2Store(newLineMap);
  };

  const save2Store = async (map: Map<string, LineInfo>) => {
    const store = await load("store.json", { autoSave: false });
    await store.set("cb.line_list", Array.from(map.values()));
    await store.save();
  };

  return (
    <>
      <div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => addLine()}
        >
          {t("InputList.NewLine")}
        </Button>
        <div>
          {Array.from(lineMap.entries()).map(([key, value]) => (
            <div style={{ marginTop: 15 }}>
              <InputLine
                key={key}
                setLineInfo={setLineInfo}
                lineInfo={value}
                delLine={delLine}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Index;
