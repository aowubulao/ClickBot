import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { Button, Input, message } from "antd";
import {
  isRegistered,
  register,
  ShortcutEvent,
  unregisterAll,
} from "@tauri-apps/plugin-global-shortcut";
import { load } from "@tauri-apps/plugin-store";
import { LineInfo } from "./Interfaces.tsx";

interface IProps {}

const Index: React.FC<IProps> = () => {
  const [start, setStart] = useState("Ctrl+Shift+A");
  const [end, setEnd] = useState("Ctrl+Shift+B");

  useEffect(() => {
    init();
    return () => {
      unregisterAll();
    };
  }, []);

  const init = async () => {
    const store = await load("store.json", { autoSave: false });
    let startShortcut = await store.get<string>("cb.shortcut.start");
    if (startShortcut) {
      setStart(startShortcut);
    } else {
      startShortcut = "Ctrl+Shift+A";
    }
    let endShortcut = await store.get<string>("cb.shortcut.end");
    if (endShortcut) {
      setEnd(endShortcut);
    } else {
      endShortcut = "Ctrl+Shift+B";
    }
    saveAndRegister(startShortcut, endShortcut, true);
  };

  const handleKeyDown = async (e: any, type: number) => {
    e.preventDefault();

    const keys = [];
    if (e.ctrlKey) {
      keys.push("Control");
    }
    if (e.shiftKey) {
      keys.push("Shift");
    }
    if (e.altKey) {
      keys.push("Alt");
    }
    if (e.metaKey) {
      keys.push("Command");
    }

    if (!["Control", "Shift", "Alt", "Command", "Meta"].includes(e.key)) {
      keys.push(e.key.toUpperCase());
    }

    const store = await load("store.json", { autoSave: false });
    if (type === 1) {
      const key = keys.join("+");
      await store.set("cb.shortcut.start", key);
      setStart(key);
    } else {
      const key = keys.join("+");
      await store.set("cb.shortcut.end", key);
      setEnd(key);
    }
  };

  const saveAndRegister = async (
    startKey: string,
    endKey: string,
    isInit: boolean
  ) => {
    try {
      await unregisterAll();
      const isStartR = await isRegistered(startKey);
      if (!isStartR) {
        await register(startKey, async (e: ShortcutEvent) => {
          if (e.state === "Released") {
            const store = await load("store.json", { autoSave: false });
            const storeLineList = await store.get<LineInfo[]>("cb.line_list");
            if (storeLineList && storeLineList.length > 0) {
              storeLineList.filter((line) => line.enable);
              if (storeLineList.length > 0) {
                await invoke("run_keyboard", { lineList: storeLineList });
                message.info("开始连点");
              }
            }
          }
        });
      }
      const isEndR = await isRegistered(endKey);
      if (!isEndR) {
        await register(endKey, async (e: ShortcutEvent) => {
          if (e.state === "Released") {
            await invoke("stop_keyboard");
            message.info("结束连点");
          }
        });
      }
    } catch (e) {
      if (!isInit) {
        message.error("保存出错:" + e);
      }
    }
  };

  return (
    <>
      <div>
        <span>
          启动热键：
          <Input
            style={{ width: 200 }}
            value={start}
            onKeyDown={(e) => {
              handleKeyDown(e, 1);
            }}
            placeholder="键入启动快捷键"
            readOnly
          />
        </span>
        <span style={{ marginLeft: 30 }}>
          结束热键：
          <Input
            style={{ width: 200 }}
            value={end}
            onKeyDown={(e) => {
              handleKeyDown(e, 2);
            }}
            placeholder="键入结束快捷键"
            readOnly
          />
        </span>
        <Button
          type={"primary"}
          style={{ marginLeft: 20 }}
          onClick={() => {
            saveAndRegister(start, end, false).then(() =>
              message.success("保存成功!")
            );
          }}
        >
          保存
        </Button>
      </div>
    </>
  );
};

export default Index;
