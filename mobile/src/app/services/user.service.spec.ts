import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { UserService } from "./user.service";
import { environment } from "src/environments/environment";
import { TestBed } from "@angular/core/testing";

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  const mockUser = { id: 1, name: 'John Doe', email: 'johndoe@example.com' };
  const apiUrl = `${environment.api}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // Vérifie qu'aucune requête en attente
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUser', () => {
    it('should call GET API to fetch user data', () => {
      service.getUser().subscribe((data) => {
        expect(data).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser); // Simule une réponse avec les données mockées
    });
  });

  describe('updateUser', () => {
    it('should call PUT API to update user data', () => {
      service.updateUser(mockUser).subscribe((data) => {
        expect(data).toEqual(mockUser);
      });

      const req = httpTestingController.expectOne(apiUrl);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockUser); // Vérifie le corps de la requête
      req.flush(mockUser); // Simule une réponse avec les données mockées
    });
  });
});