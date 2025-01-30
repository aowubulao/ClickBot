import React, { useEffect, useState } from "react";
import { Button, Form, Modal, Select } from "antd";
import { SettingOutlined } from "@ant-design/icons";
import "./style.css";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface IProps {}

const Index: React.FC<IProps> = () => {
  const [configVisible, setConfigVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const { t } = useTranslation();

  useEffect(() => {
    form.setFieldValue("language", i18n.language);
  }, []);

  return (
    <>
      <div>
        {configVisible ? (
          <Modal
            title={t("Config.Modal.Title")}
            open={configVisible}
            onOk={() => setConfigVisible(false)}
            onCancel={() => setConfigVisible(false)}
            footer={null}
          >
            <Form
              style={{ height: 150, marginTop: 40 }}
              name="basic"
              labelCol={{ span: 5 }}
              labelAlign={"left"}
              form={form}
            >
              <Form.Item
                label={t("Config.Modal.Language.Label")}
                name="language"
              >
                <Select
                  onChange={(e: string) => {
                    i18n.changeLanguage(e);
                    localStorage.setItem("cb.language", e);
                  }}
                  options={[
                    {
                      value: "zh",
                      label: "简体中文",
                    },
                    {
                      value: "en",
                      label: "English",
                    },
                    {
                      value: "ja",
                      label: "日本語",
                    },
                  ]}
                />
              </Form.Item>
            </Form>
          </Modal>
        ) : null}
        <Button
          onClick={() => setConfigVisible(true)}
          className={"fixed-button"}
          icon={<SettingOutlined />}
        ></Button>
      </div>
    </>
  );
};

export default Index;
