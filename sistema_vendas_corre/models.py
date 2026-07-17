from datetime import datetime
from database import get_connection


def data_hora_agora():
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


def registrar_movimento_banco(descricao, tipo, valor):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO movimentos_banco (data_hora, descricao, tipo, valor)
        VALUES (?, ?, ?, ?)
    """, (
        data_hora_agora(),
        descricao,
        tipo,
        valor
    ))

    conn.commit()
    conn.close()


def get_banco_config(chave):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT valor
        FROM banco_config
        WHERE chave = ?
    """, (chave,))

    resultado = cursor.fetchone()
    conn.close()

    if resultado:
        return resultado[0]

    return 0


def set_banco_config(chave, valor):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT OR REPLACE INTO banco_config (chave, valor)
        VALUES (?, ?)
    """, (chave, valor))

    conn.commit()
    conn.close()


def saldo_banco_esperado():
    saldo_inicial = get_banco_config("saldo_inicial")

    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            SUM(
                CASE 
                    WHEN tipo = 'entrada' THEN valor
                    WHEN tipo = 'saida' THEN -valor
                    ELSE 0
                END
            )
        FROM movimentos_banco
    """)

    movimentos = cursor.fetchone()[0] or 0

    conn.close()

    return saldo_inicial + movimentos


def listar_movimentos_banco():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, data_hora, descricao, tipo, valor
        FROM movimentos_banco
        ORDER BY id DESC
    """)

    dados = cursor.fetchall()
    conn.close()

    return dados


def listar_produtos():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM produtos ORDER BY nome")
    dados = cursor.fetchall()
    conn.close()
    return dados


def adicionar_produto(nome, codigo, preco_compra, preco_venda, quantidade, estoque_minimo):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO produtos (
            nome,
            codigo,
            preco_compra,
            preco_venda,
            quantidade,
            estoque_minimo
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        nome,
        codigo,
        preco_compra,
        preco_venda,
        quantidade,
        estoque_minimo
    ))

    conn.commit()
    conn.close()


def atualizar_produto(id_produto, nome, codigo, preco_compra, preco_venda, quantidade, estoque_minimo):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE produtos
        SET nome = ?,
            codigo = ?,
            preco_compra = ?,
            preco_venda = ?,
            quantidade = ?,
            estoque_minimo = ?
        WHERE id = ?
    """, (
        nome,
        codigo,
        preco_compra,
        preco_venda,
        quantidade,
        estoque_minimo,
        id_produto
    ))

    conn.commit()
    conn.close()


def deletar_produto(id_produto):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM produtos WHERE id = ?", (id_produto,))
    conn.commit()
    conn.close()


def repor_estoque(produto_id, quantidade_gramas, custo_total):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE produtos
        SET quantidade = quantidade + ?
        WHERE id = ?
    """, (
        quantidade_gramas,
        produto_id
    ))

    cursor.execute("""
        INSERT INTO compras_estoque (
            produto_id,
            data_hora,
            quantidade,
            custo_total
        )
        VALUES (?, ?, ?, ?)
    """, (
        produto_id,
        data_hora_agora(),
        quantidade_gramas,
        custo_total
    ))

    conn.commit()
    conn.close()

    registrar_movimento_banco(
        "Reposição de estoque",
        "saida",
        custo_total
    )


def listar_clientes():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM clientes ORDER BY nome")
    dados = cursor.fetchall()
    conn.close()
    return dados


def adicionar_cliente(nome, telefone, endereco, limite_credito):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO clientes (
            nome,
            telefone,
            endereco,
            limite_credito
        )
        VALUES (?, ?, ?, ?)
    """, (
        nome,
        telefone,
        endereco,
        limite_credito
    ))

    conn.commit()
    conn.close()


def atualizar_cliente(id_cliente, nome, telefone, endereco, limite_credito):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE clientes
        SET nome = ?,
            telefone = ?,
            endereco = ?,
            limite_credito = ?
        WHERE id = ?
    """, (
        nome,
        telefone,
        endereco,
        limite_credito,
        id_cliente
    ))

    conn.commit()
    conn.close()


def deletar_cliente(id_cliente):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clientes WHERE id = ?", (id_cliente,))
    conn.commit()
    conn.close()


def registrar_venda(itens, cliente_id, tipo, valor_pago=0):
    conn = get_connection()
    cursor = conn.cursor()

    valor_total = 0
    data_hora_venda = data_hora_agora()

    for produto_id, gramas in itens:
        cursor.execute("""
            SELECT preco_venda, quantidade
            FROM produtos
            WHERE id = ?
        """, (produto_id,))

        produto = cursor.fetchone()

        if not produto:
            conn.close()
            raise Exception("Produto não encontrado")

        preco_venda, estoque_atual = produto

        if gramas > estoque_atual:
            conn.close()
            raise Exception("Estoque insuficiente")

        valor_total += preco_venda * gramas

    if tipo == "avista":
        valor_pago = valor_total

    status = "quitado"

    if tipo == "fiado" and valor_pago < valor_total:
        status = "aberta"

    cursor.execute("""
        INSERT INTO vendas (
            data_hora,
            cliente_id,
            tipo,
            valor_total,
            valor_pago,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data_hora_venda,
        cliente_id,
        tipo,
        valor_total,
        valor_pago,
        status
    ))

    venda_id = cursor.lastrowid

    for produto_id, gramas in itens:
        cursor.execute("""
            SELECT preco_venda
            FROM produtos
            WHERE id = ?
        """, (produto_id,))

        preco_venda = cursor.fetchone()[0]

        cursor.execute("""
            INSERT INTO itens_venda (
                venda_id,
                produto_id,
                quantidade,
                preco_unitario_venda
            )
            VALUES (?, ?, ?, ?)
        """, (
            venda_id,
            produto_id,
            gramas,
            preco_venda
        ))

        cursor.execute("""
            UPDATE produtos
            SET quantidade = quantidade - ?
            WHERE id = ?
        """, (
            gramas,
            produto_id
        ))

    conn.commit()
    conn.close()

    valor_entrada_banco = valor_pago

    if valor_entrada_banco > 0:
        registrar_movimento_banco(
            f"Venda #{venda_id}",
            "entrada",
            valor_entrada_banco
        )

    return True


def listar_vendas():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            v.id,
            v.data_hora,
            COALESCE(c.nome, 'Sem cliente') AS cliente,
            v.tipo,
            v.valor_total,
            v.valor_pago,
            v.status
        FROM vendas v
        LEFT JOIN clientes c ON c.id = v.cliente_id
        ORDER BY v.id DESC
    """)

    dados = cursor.fetchall()
    conn.close()

    return dados


def obter_itens_venda(venda_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            iv.produto_id,
            p.nome,
            iv.quantidade,
            iv.preco_unitario_venda
        FROM itens_venda iv
        JOIN produtos p ON p.id = iv.produto_id
        WHERE iv.venda_id = ?
    """, (venda_id,))

    dados = cursor.fetchall()
    conn.close()

    return dados


def excluir_venda(venda_id):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT valor_pago
        FROM vendas
        WHERE id = ?
    """, (venda_id,))

    venda = cursor.fetchone()

    valor_pago = 0

    if venda:
        valor_pago = venda[0] or 0

    cursor.execute("""
        SELECT produto_id, quantidade
        FROM itens_venda
        WHERE venda_id = ?
    """, (venda_id,))

    itens = cursor.fetchall()

    for produto_id, quantidade in itens:
        cursor.execute("""
            UPDATE produtos
            SET quantidade = quantidade + ?
            WHERE id = ?
        """, (
            quantidade,
            produto_id
        ))

    cursor.execute("DELETE FROM itens_venda WHERE venda_id = ?", (venda_id,))
    cursor.execute("DELETE FROM vendas WHERE id = ?", (venda_id,))

    conn.commit()
    conn.close()

    if valor_pago > 0:
        registrar_movimento_banco(
            f"Estorno da venda #{venda_id}",
            "saida",
            valor_pago
        )


def faturamento_bruto_liquido(data_inicio, data_fim):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT SUM(valor_total)
        FROM vendas
        WHERE DATE(data_hora) BETWEEN ? AND ?
    """, (
        data_inicio,
        data_fim
    ))

    bruto = cursor.fetchone()[0] or 0

    cursor.execute("""
        SELECT SUM(iv.quantidade * p.preco_compra)
        FROM itens_venda iv
        JOIN vendas v ON iv.venda_id = v.id
        JOIN produtos p ON iv.produto_id = p.id
        WHERE DATE(v.data_hora) BETWEEN ? AND ?
    """, (
        data_inicio,
        data_fim
    ))

    custo = cursor.fetchone()[0] or 0

    conn.close()

    return bruto, bruto - custo


def get_total_fiado():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT SUM(valor_total - valor_pago)
        FROM vendas
        WHERE tipo = 'fiado'
        AND status = 'aberta'
    """)

    total = cursor.fetchone()[0] or 0

    conn.close()

    return total


def total_gasto_estoque():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT SUM(custo_total)
        FROM compras_estoque
    """)

    total = cursor.fetchone()[0] or 0

    conn.close()

    return total


def gasto_por_produto():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT 
            p.nome,
            SUM(c.quantidade),
            SUM(c.custo_total)
        FROM compras_estoque c
        JOIN produtos p ON c.produto_id = p.id
        GROUP BY p.id, p.nome
        ORDER BY SUM(c.custo_total) DESC
    """)

    dados = cursor.fetchall()

    conn.close()

    return dados