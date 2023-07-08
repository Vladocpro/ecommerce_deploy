import getCurrentUser from "../../actions/getCurrentUser";
import {NextResponse} from "next/server";

export async function GET() {

   try {
      const currentUser  = await getCurrentUser();
      if(currentUser === null) {
         return NextResponse.error();
      }
      return NextResponse.json(currentUser)

   } catch (e) {
      console.log(e)
   }

}
