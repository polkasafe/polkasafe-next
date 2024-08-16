import { userLogin } from "@substrate/app/api/v1/userLogin/login";
import { withErrorHandling } from "@substrate/app/api/api-utils";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const POST = withErrorHandling(async (req: NextRequest) => {
	const headers = req.headers;
  const address = headers.get('x-address');
  const signature = headers.get('x-signature');

  if(!address || !signature) {
    return NextResponse.error();
  }

  const { data } = await userLogin(address, signature) as any;
  console.log(data);
  if(!data) {
    return NextResponse.error();
  }
  data.signature = signature;
  const cookie = cookies();
  cookie.set('user', JSON.stringify(data.data ? data.data : data))

	return NextResponse.json(data);
});
