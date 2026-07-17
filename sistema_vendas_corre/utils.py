def faturamento_liquido(data_inicio, data_fim):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT SUM(iv.quantidade * p.preco_compra) 
        FROM itens_venda iv
        JOIN vendas v ON iv.venda_id = v.id
        JOIN produtos p ON iv.produto_id = p.id
        WHERE v.data_hora BETWEEN ? AND ?
    ''', (data_inicio, data_fim))
    custo_total = cursor.fetchone()[0] or 0
    cursor.execute('SELECT SUM(valor_total) FROM vendas WHERE data_hora BETWEEN ? AND ?', (data_inicio, data_fim))
    bruto = cursor.fetchone()[0] or 0
    conn.close()
    liquido = bruto - custo_total
    return bruto, liquido
