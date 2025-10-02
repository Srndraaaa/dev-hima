import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { RedirectToSignIn } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export async function requireAdmin() {
  const user = await currentUser();
  
  if (!user) {
    return <RedirectToSignIn />;
  }
  
  // You can check for specific admin role/permissions here
  // For now, we'll assume any signed-in user can be an admin
  // In a real application, you'd check for an admin role
  const isAdmin = process.env.ADMIN_USERS?.split(',').includes(user.emailAddresses[0]?.emailAddress) || 
                 user.emailAddresses[0]?.emailAddress === process.env.ADMIN_EMAIL;
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-red-50 border border-red-200 rounded-lg max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">Akses Ditolak</h2>
          <p className="text-red-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
          <div className="mt-4">
            <UserButton />
          </div>
        </div>
      </div>
    );
  }
  
  return user;
}