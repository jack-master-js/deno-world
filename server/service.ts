class Service {
    index(req: any, res: any) {
        res.render('index');
    }
    welcome(req: any, res: any) {
        res.success();
    }
}

export default new Service();
