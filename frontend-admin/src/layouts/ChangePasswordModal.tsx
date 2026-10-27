import { Form, Input, Modal, message } from "antd"
import { useTranslation } from "react-i18next"
import { changePassword } from "../apis/profileModule"
import CustomHooks from "../common/hooks/CustomHooks"

interface ChangePasswordValues {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

export default function ChangePasswordModal({
  open,
  onCancel,
}: {
  open: boolean
  onCancel: () => void
}) {
  const { t } = useTranslation()
  const [form] = Form.useForm<ChangePasswordValues>()
  const { mutate, isPending } = CustomHooks.useMutation(changePassword, {
    onSuccess: (response) => {
      message.success(response.message || t("account.passwordUpdated"))
      form.resetFields()
      onCancel()
    },
  })

  const close = () => {
    form.resetFields()
    onCancel()
  }

  const submit = (values: ChangePasswordValues) => {
    mutate({ oldPassword: values.oldPassword, newPassword: values.newPassword })
  }

  return (
    <Modal
      title={t("account.changePassword")}
      open={open}
      onCancel={close}
      onOk={() => form.submit()}
      confirmLoading={isPending}
      okText={t("common.save")}
      cancelText={t("common.cancel")}
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={submit}>
        <Form.Item
          label={t("account.currentPassword")}
          name="oldPassword"
          rules={[{ required: true, message: t("account.currentPasswordRequired") }]}
        >
          <Input.Password autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          label={t("account.newPassword")}
          name="newPassword"
          rules={[{ required: true, message: t("account.newPasswordRequired") }]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label={t("account.confirmPassword")}
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: t("account.confirmPasswordRequired") },
            ({ getFieldValue }) => ({
              validator(_, value: string) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error(t("account.passwordMismatch")))
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  )
}
