import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "db", "vendas.db")


def get_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

    conn = get_connection()
    cursor = conn.cursor()

    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            codigo TEXT UNIQUE,
            preco_compra REAL NOT NULL,
            preco_venda REAL NOT NULL,
            quantidade REAL NOT NULL DEFAULT 0,
            estoque_minimo REAL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS clientes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            telefone TEXT,
            endereco TEXT,
            limite_credito REAL DEFAULT 0,
            saldo_devedor REAL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS vendas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            cliente_id INTEGER,
            tipo TEXT CHECK(tipo IN ('avista', 'fiado')) DEFAULT 'avista',
            valor_total REAL NOT NULL,
            valor_pago REAL DEFAULT 0,
            status TEXT DEFAULT 'aberta',
            FOREIGN KEY(cliente_id) REFERENCES clientes(id)
        );

        CREATE TABLE IF NOT EXISTS itens_venda (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            venda_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade REAL NOT NULL,
            preco_unitario_venda REAL NOT NULL,
            FOREIGN KEY(venda_id) REFERENCES vendas(id),
            FOREIGN KEY(produto_id) REFERENCES produtos(id)
        );

        CREATE TABLE IF NOT EXISTS compras_estoque (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            produto_id INTEGER NOT NULL,
            data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            quantidade REAL NOT NULL,
            custo_total REAL NOT NULL,
            FOREIGN KEY(produto_id) REFERENCES produtos(id)
        );

        CREATE TABLE IF NOT EXISTS banco_config (
            chave TEXT PRIMARY KEY,
            valor REAL DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS movimentos_banco (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            descricao TEXT NOT NULL,
            tipo TEXT CHECK(tipo IN ('entrada', 'saida')) NOT NULL,
            valor REAL NOT NULL
        );
    """)

    cursor.execute("""
        INSERT OR IGNORE INTO banco_config (chave, valor)
        VALUES ('saldo_inicial', 0)
    """)

    cursor.execute("""
        INSERT OR IGNORE INTO banco_config (chave, valor)
        VALUES ('saldo_atual_informado', 0)
    """)

    conn.commit()
    conn.close()

    print("Banco de dados inicializado com sucesso!")