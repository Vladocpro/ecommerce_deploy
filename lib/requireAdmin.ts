import {NextResponse} from "next/server";
import getCurrentUser from "../app/actions/getCurrentUser";

// Returns an error response for non-admins, or null when the caller may proceed.
// Pages only hide the admin UI; every admin API route must call this itself.
export async function requireAdmin() {
   const currentUser = await getCurrentUser();
   if (!currentUser) {
      return NextResponse.json({error: "Log into your account"}, {status: 401});
   }
   if (currentUser.role !== "Admin") {
      return NextResponse.json({error: "Admin access required"}, {status: 403});
   }
   return null;
}
