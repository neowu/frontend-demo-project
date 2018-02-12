import userAJAXService = app.user.userAJAXService;

export class UserAJAXServiceImpl implements app.user.UserAJAXService {
    login: (request: app.user.LoginRequest) => Promise<app.user.LoginResponse>;

    getUserById(id: string, request: app.user.LoginRequest): Promise<app.user.LoginResponse> {
        return api.put(userAJAXService.getUserById.path, request);
    }
}
