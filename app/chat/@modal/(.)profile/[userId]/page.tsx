import UserProfileContent from "@/components/profile/UserProfileContent";
import Modal from "@/components/Modal";

export default async function ProfileModalPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <Modal>
      <UserProfileContent userId={userId} />
    </Modal>
  );
}
