export const ExportError = (res: any, errorCode:any):string[] =>{
    let apiResponse:ApiResponse = res;
    let arrayErrorMessage:string[] = [];
    for (let i:number = 0; i<apiResponse.error.length; i++ ) {
        for (const key in errorCode) {
            if (Object.prototype.hasOwnProperty.call(errorCode, key)) {
               
              const value = errorCode[key as keyof typeof errorCode];
              if (key === apiResponse.error[i].code){
                arrayErrorMessage.push(value);
              }
            }
          }
    }

    return arrayErrorMessage;

}
 