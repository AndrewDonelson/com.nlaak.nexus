import Breadcrumb from '@/components/shared/Breadcrumb';
import Profile from '@/components/shared/Profile';

const ProfilePage = () => {
  return (
    <div className="p-4 mt-16">
      <Breadcrumb />
      <Profile 
        username="AndrewDonelson"
        name="Andrew Donelson"
        avatarUrl="images/avatar.png"
        bannerUrl="images/woman.v4.png"
        bio="1A | 2A | Family | Conservative | MAGA | America First | Engineer | Founder of gwf.io"
        location="Houston, TX"
        website="https://andrewdonelson.com"
        joinDate="July 2009"
        followingCount={371}
        followersCount={391}
        verified={true}
        tags={["1A", "2A", "Family", "Conservative", "MAGA", "America First", "Engineer"]}
      />
    </div>
  );
};

export default ProfilePage;