export class Services {

    public static getDocuments(urlPath: string):Promise<any[]> {
        return new Promise((resolve, reject) => {
            fetch(urlPath,{
                    method: 'GET',
                    headers: {'Accept': 'application/json; odata=verbose','Content-type': 'application/json'}
                }).then(Response => Response.json()).then((jsonData: any[]) => {
                    resolve(jsonData);
                }).catch(err => {
                    reject(err);
            });
        });
    }

}