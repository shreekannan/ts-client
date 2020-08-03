import { PlaceRepository } from '../../../../src/http/services/repositories/repository.class';
import { PlaceRepositoryType } from '../../../../src/http/services/repositories/repository.interfaces';
import { generateMockRepository } from '../../../../src/http/services/repositories/repository.utilities';

describe('PlaceRepository', () => {
    let repository: PlaceRepository;
    let service: any;
    let mock_data: any;

    beforeEach(() => {
        service = {
            reload: jest.fn(),
            remove: jest.fn(),
            update: jest.fn()
        };
        mock_data = generateMockRepository({ repo_type: PlaceRepositoryType.Driver });
        repository = new PlaceRepository(mock_data);
    });

    it('should create instance', () => {
        expect(repository).toBeTruthy();
        expect(repository).toBeInstanceOf(PlaceRepository);
    });

    it('should expose commit hash', () => {
        expect(repository.commit_hash).toBe(mock_data.commit_hash);
    });

    it('should expose folder name', () => {
        expect(repository.folder_name).toBe(mock_data.folder_name);
    });

    it('should expose description', () => {
        expect(repository.description).toBe(mock_data.description);
    });

    it('should expose URI', () => {
        expect(repository.uri).toBe(mock_data.uri);
    });

    it('should expose type', () => {
        expect(repository.type).toBe(PlaceRepositoryType.Driver);
    });
});
