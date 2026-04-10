interface ISuccessResponse {
  status: "success";
  data: any;
}
export const successResponse = (data: any): ISuccessResponse => {
  return {
    status: "success",
    data,
  };
};
