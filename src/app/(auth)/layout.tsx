export const metadata = {
  title: "Chat App",
  description: "Generated by create next app",
};

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-200">
      <div className="w-full py-8">
        <div className="mx-auto mt-8 w-[350px] rounded-lg bg-white px-8 py-4 shadow-2xl md:w-1/2 md:px-12 lg:w-1/3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
