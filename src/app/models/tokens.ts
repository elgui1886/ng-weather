import { HttpContextToken } from "@angular/common/http";

export const HTTP_CONTEXT = new HttpContextToken(() => {
    return {
      zip: undefined,
      call: undefined,
    };
  });