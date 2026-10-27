import { Alert, Avatar, Button, Card, DatePicker, Form, Input, Select, Space, Spin, Typography, message } from "antd"
import dayjs, { Dayjs } from "dayjs"
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { fetchProfile, updateProfile, UpdateProfileRequest } from "../../apis/profileModule"
import CustomHooks from "../../common/hooks/CustomHooks"
import { QUERY_KEYS } from "../../common/queryKeys"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { getAccount } from "../../redux/slice/accountSlice"
import { GenderEnum } from "../../types/enum"

const { Title, Text } = Typography

interface ProfileFormValues {
  name: string
  phone?: string
  address?: string
  gender?: GenderEnum
  avatar?: string
  dob?: Dayjs
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const [form] = Form.useForm<ProfileFormValues>()
  const dispatch = useAppDispatch()
  const account = useAppSelector((state) => state.account.user)
  const { data, isLoading, isError, refetch } = CustomHooks.useQuery(
    [QUERY_KEYS.USER_MODULE, "profile"],
    fetchProfile,
  )
  const profile = data?.data

  useEffect(() => {
    if (!profile) return
    form.setFieldsValue({
      name: profile.name,
      phone: profile.phone || undefined,
      address: profile.address || undefined,
      gender: profile.gender || undefined,
      avatar: profile.avatar || undefined,
      dob: profile.dob ? dayjs(profile.dob) : undefined,
    })
  }, [form, profile])

  const { mutate, isPending } = CustomHooks.useMutation(updateProfile, {
    onSuccess: (response) => {
      message.success(response.message || t("account.profileUpdated"))
      refetch()
      dispatch(getAccount())
    },
  })

  const submit = (values: ProfileFormValues) => {
    const payload: UpdateProfileRequest = {
      name: values.name.trim(),
      phone: values.phone?.trim() || null,
      address: values.address?.trim() || null,
      gender: values.gender || null,
      avatar: values.avatar?.trim() || null,
      dob: values.dob ? values.dob.format("DD/MM/YYYY") : null,
    }
    mutate(payload)
  }

  return (
    <Card>
      <Space align="center" size="middle" style={{ marginBottom: 24 }}>
        <Avatar src={profile?.avatar || account.avatar} size={64}>
          {profile?.name?.[0] || account.name?.[0]}
        </Avatar>
        <div>
          <Title level={3} style={{ margin: 0 }}>{t("account.profile")}</Title>
          <Text type="secondary">{profile?.email || account.email}</Text>
        </div>
      </Space>

      {isError ? (
        <Alert
          type="error"
          showIcon
          message={t("account.profileLoadError")}
          action={<Button onClick={() => refetch()}>{t("account.retry")}</Button>}
        />
      ) : (
        <Spin spinning={isLoading}>
        <Form form={form} layout="vertical" onFinish={submit} disabled={isLoading}>
          <Form.Item label={t("account.email")}>
            <Input value={profile?.email || account.email} disabled />
          </Form.Item>
          <Form.Item
            label={t("account.name")}
            name="name"
            rules={[{ required: true, whitespace: true, message: t("account.nameRequired") }]}
          >
            <Input />
          </Form.Item>
          <Form.Item label={t("account.phone")} name="phone">
            <Input />
          </Form.Item>
          <Form.Item label={t("account.address")} name="address">
            <Input />
          </Form.Item>
          <Form.Item label={t("account.gender")} name="gender">
            <Select allowClear options={Object.values(GenderEnum).map((value) => ({ value, label: t(`account.genders.${value}`) }))} />
          </Form.Item>
          <Form.Item label={t("account.dateOfBirth")} name="dob">
            <DatePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item label={t("account.avatarUrl")} name="avatar">
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isPending} disabled={isLoading || !profile}>
            {t("common.save")}
          </Button>
        </Form>
        </Spin>
      )}
    </Card>
  )
}
