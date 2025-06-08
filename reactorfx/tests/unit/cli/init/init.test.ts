
import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { initReactorFX } from '../../../../src/cli/init';

jest.mock('fs');
jest.mock('path');
jest.mock('readline');

describe('initReactorFX', () => {
  const CONFIG_FILE = '/mocked/path/vite.config.ts';
  const BACKUP_FILE = '/mocked/path/vite.config.ts.bak';

  beforeEach(() => {
    jest.resetAllMocks();

    (path.resolve as jest.Mock).mockReturnValue(CONFIG_FILE);

    // fs mocks
    (fs.existsSync as jest.Mock).mockReturnValue(false);
    (fs.writeFileSync as jest.Mock).mockImplementation(() => {});
    (fs.copyFileSync as jest.Mock).mockImplementation(() => {});
    (fs.readFileSync as jest.Mock).mockReturnValue(''); // conteúdo do arquivo
    (fs.unlinkSync as jest.Mock).mockImplementation(() => {});

    // readline mocks
    const questionMock = jest.fn();
    const closeMock = jest.fn();

    (readline.createInterface as jest.Mock).mockReturnValue({
      question: (questionText: string, cb: (answer: string) => void) => {
        questionMock(questionText);
        // Simula usuário respondendo 'y' para todas as perguntas
        cb('y');
      },
      close: closeMock,
    });
  });

  it('should cancel operation if user denies permission', async () => {
    (readline.createInterface as jest.Mock).mockReturnValue({
      question: (questionText: string, cb: (answer: string) => void) => {
        cb('n'); // usuário nega permissão
      },
      close: jest.fn(),
    });

    await initReactorFX();

    expect(fs.writeFileSync).not.toHaveBeenCalled();
  });
});
