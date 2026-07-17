import tkinter as tk
from tkinter import ttk, messagebox
from datetime import date, datetime

from database import init_db
from models import (
    listar_produtos,
    adicionar_produto,
    atualizar_produto,
    deletar_produto,
    repor_estoque,
    listar_clientes,
    adicionar_cliente,
    atualizar_cliente,
    deletar_cliente,
    registrar_venda,
    listar_vendas,
    obter_itens_venda,
    excluir_venda,
    faturamento_bruto_liquido,
    get_total_fiado,
    total_gasto_estoque,
    gasto_por_produto,
    get_banco_config,
    set_banco_config,
    saldo_banco_esperado,
    listar_movimentos_banco
)


USUARIO_PADRAO = "admin"
SENHA_PADRAO = "1234"


class LoginWindow:
    def __init__(self, root):
        self.root = root
        self.root.title("Login - Sistema de Vendas")
        self.root.geometry("400x280")
        self.root.resizable(False, False)
        self.root.configure(bg="#f3f4f6")

        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TLabel", background="#f3f4f6", font=("Segoe UI", 10))
        style.configure("TButton", font=("Segoe UI", 10, "bold"))

        ttk.Label(
            root,
            text="Sistema de Vendas",
            font=("Segoe UI", 18, "bold")
        ).pack(pady=25)

        ttk.Label(root, text="Usuário").pack()

        self.entry_usuario = ttk.Entry(root, width=30)
        self.entry_usuario.pack(pady=5)
        self.entry_usuario.insert(0, "admin")

        ttk.Label(root, text="Senha").pack()

        self.entry_senha = ttk.Entry(root, width=30, show="*")
        self.entry_senha.pack(pady=5)

        ttk.Button(
            root,
            text="Entrar",
            command=self.validar_login
        ).pack(pady=20)

        self.root.bind("<Return>", lambda event: self.validar_login())

    def validar_login(self):
        usuario = self.entry_usuario.get().strip()
        senha = self.entry_senha.get().strip()

        if usuario == USUARIO_PADRAO and senha == SENHA_PADRAO:
            self.root.destroy()

            app_root = tk.Tk()
            SistemaVendas(app_root)
            app_root.mainloop()
        else:
            messagebox.showerror("Erro", "Usuário ou senha inválidos")


class SistemaVendas:
    def __init__(self, root):
        self.root = root
        self.root.title("Sistema de Vendas - Corre")
        self.root.geometry("1200x720")
        self.root.configure(bg="#f3f4f6")

        self.carrinho = []

        style = ttk.Style()
        style.theme_use("clam")
        style.configure("Treeview", rowheight=28)
        style.configure("Treeview.Heading", font=("Segoe UI", 10, "bold"))
        style.configure("TButton", font=("Segoe UI", 10, "bold"))
        style.configure("TLabel", background="#f3f4f6", font=("Segoe UI", 10))

        self.notebook = ttk.Notebook(root)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=10)

        self.criar_aba_estoque()
        self.criar_aba_vendas()
        self.criar_aba_clientes()
        self.criar_aba_historico()
        self.criar_aba_banco()
        self.criar_aba_relatorios()
        self.criar_aba_fiado()

        self.atualizar_resumo()

    # =========================
    # UTILIDADES
    # =========================

    def moeda_para_float(self, valor):
        valor = str(valor).strip()
        valor = valor.replace("R$", "")
        valor = valor.replace(" ", "")

        if "," in valor:
            valor = valor.replace(".", "")
            valor = valor.replace(",", ".")

        return float(valor)

    def formatar_moeda(self, valor):
        valor = float(valor)
        valor_formatado = f"{valor:.2f}".replace(".", ",")
        return f"R$ {valor_formatado}"

    def formatar_gramas(self, valor):
        valor = float(valor)
        valor_formatado = f"{valor:.2f}".replace(".", ",")
        return f"{valor_formatado} g"

    def texto_moeda_para_float(self, texto):
        texto = str(texto).replace("R$", "").replace(" ", "")
        texto = texto.replace(".", "")
        texto = texto.replace(",", ".")
        return float(texto)

    def formatar_data_brasil(self, data_texto):
        try:
            data = datetime.strptime(str(data_texto), "%Y-%m-%d %H:%M:%S")
            return data.strftime("%d/%m/%Y %H:%M:%S")
        except Exception:
            return str(data_texto)

    # =========================
    # ESTOQUE
    # =========================

    def criar_aba_estoque(self):
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="Estoque")

        self.tree_produtos = ttk.Treeview(
            frame,
            columns=("ID", "Nome", "Preço Compra", "Preço Venda", "Quantidade", "Estoque Mínimo"),
            show="headings"
        )

        for col in ("ID", "Nome", "Preço Compra", "Preço Venda", "Quantidade", "Estoque Mínimo"):
            self.tree_produtos.heading(col, text=col)

        self.tree_produtos.pack(fill="both", expand=True, pady=10)

        botoes = ttk.Frame(frame)
        botoes.pack(pady=10)

        ttk.Button(botoes, text="Adicionar Produto", command=self.adicionar_produto_janela).pack(side="left", padx=5)
        ttk.Button(botoes, text="Editar", command=self.editar_produto_janela).pack(side="left", padx=5)
        ttk.Button(botoes, text="Repor Estoque", command=self.repor_estoque_janela).pack(side="left", padx=5)
        ttk.Button(botoes, text="Excluir", command=self.excluir_produto).pack(side="left", padx=5)

        self.carregar_produtos()

    def carregar_produtos(self):
        for item in self.tree_produtos.get_children():
            self.tree_produtos.delete(item)

        for p in listar_produtos():
            self.tree_produtos.insert(
                "",
                "end",
                values=(
                    p[0],
                    p[1],
                    self.formatar_moeda(p[3]),
                    self.formatar_moeda(p[4]),
                    self.formatar_gramas(p[5]),
                    self.formatar_gramas(p[6])
                )
            )

    def adicionar_produto_janela(self):
        self.janela_produto("Adicionar Produto", None)

    def editar_produto_janela(self):
        selecionado = self.tree_produtos.selection()

        if not selecionado:
            return

        id_produto = self.tree_produtos.item(selecionado[0])["values"][0]
        produto = next((p for p in listar_produtos() if p[0] == id_produto), None)

        if produto:
            self.janela_produto("Editar Produto", produto)

    def janela_produto(self, titulo, produto):
        win = tk.Toplevel(self.root)
        win.title(titulo)
        win.geometry("430x430")
        win.configure(bg="#f3f4f6")

        campos = ["Nome", "Código", "Preço Compra", "Preço Venda", "Quantidade em Gramas", "Estoque Mínimo"]
        entries = {}

        for i, campo in enumerate(campos):
            ttk.Label(win, text=campo).grid(row=i, column=0, padx=10, pady=10, sticky="w")

            entry = ttk.Entry(win, width=30)
            entry.grid(row=i, column=1, padx=10, pady=10)

            entries[campo] = entry

        if produto:
            entries["Nome"].insert(0, produto[1])
            entries["Código"].insert(0, produto[2] or "")
            entries["Preço Compra"].insert(0, str(produto[3]).replace(".", ","))
            entries["Preço Venda"].insert(0, str(produto[4]).replace(".", ","))
            entries["Quantidade em Gramas"].insert(0, str(produto[5]).replace(".", ","))
            entries["Estoque Mínimo"].insert(0, str(produto[6]).replace(".", ","))

        def salvar():
            try:
                nome = entries["Nome"].get()
                codigo = entries["Código"].get()
                preco_compra = self.moeda_para_float(entries["Preço Compra"].get())
                preco_venda = self.moeda_para_float(entries["Preço Venda"].get())
                quantidade = self.moeda_para_float(entries["Quantidade em Gramas"].get())
                estoque_minimo = self.moeda_para_float(entries["Estoque Mínimo"].get())

                if produto:
                    atualizar_produto(produto[0], nome, codigo, preco_compra, preco_venda, quantidade, estoque_minimo)
                else:
                    adicionar_produto(nome, codigo, preco_compra, preco_venda, quantidade, estoque_minimo)

                self.carregar_produtos()
                self.carregar_combo_produtos()
                self.atualizar_resumo()

                win.destroy()

                messagebox.showinfo("Sucesso", "Produto salvo com sucesso")

            except Exception as e:
                messagebox.showerror("Erro", str(e))

        ttk.Button(
            win,
            text="Salvar Produto",
            command=salvar
        ).grid(row=len(campos), column=0, columnspan=2, pady=20)

    def repor_estoque_janela(self):
        selecionado = self.tree_produtos.selection()

        if not selecionado:
            return

        id_produto = self.tree_produtos.item(selecionado[0])["values"][0]

        win = tk.Toplevel(self.root)
        win.title("Repor Estoque")
        win.geometry("350x250")
        win.configure(bg="#f3f4f6")

        ttk.Label(win, text="Quantidade em gramas").pack(pady=10)

        entry_qtd = ttk.Entry(win)
        entry_qtd.pack()

        ttk.Label(win, text="Valor gasto").pack(pady=10)

        entry_custo = ttk.Entry(win)
        entry_custo.pack()

        def salvar():
            try:
                quantidade = self.moeda_para_float(entry_qtd.get())
                custo = self.moeda_para_float(entry_custo.get())

                repor_estoque(id_produto, quantidade, custo)

                self.carregar_produtos()
                self.carregar_combo_produtos()
                self.atualizar_resumo()

                win.destroy()

                messagebox.showinfo("Sucesso", "Estoque atualizado")

            except Exception as e:
                messagebox.showerror("Erro", str(e))

        ttk.Button(
            win,
            text="Salvar Reposição",
            command=salvar
        ).pack(pady=20)

    def excluir_produto(self):
        selecionado = self.tree_produtos.selection()

        if not selecionado:
            return

        id_produto = self.tree_produtos.item(selecionado[0])["values"][0]

        if messagebox.askyesno("Confirmar", "Excluir produto?"):
            deletar_produto(id_produto)
            self.carregar_produtos()
            self.carregar_combo_produtos()
            self.atualizar_resumo()

    # =========================
    # VENDAS
    # =========================

    def criar_aba_vendas(self):
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="Nova Venda")

        form = ttk.Frame(frame)
        form.pack(fill="x", pady=10)

        ttk.Label(form, text="Produto").grid(row=0, column=0, padx=10, pady=10)

        self.combo_produtos = ttk.Combobox(form, width=70, state="readonly")
        self.combo_produtos.grid(row=0, column=1, padx=10, pady=10)
        self.combo_produtos.bind("<<ComboboxSelected>>", lambda e: self.calcular_venda_automatica())

        ttk.Label(form, text="Modo de Venda").grid(row=1, column=0, padx=10, pady=10)

        self.combo_modo_venda = ttk.Combobox(form, values=["Gramas", "Valor em R$"], state="readonly")
        self.combo_modo_venda.set("Gramas")
        self.combo_modo_venda.grid(row=1, column=1, padx=10, pady=10, sticky="w")
        self.combo_modo_venda.bind("<<ComboboxSelected>>", lambda e: self.calcular_venda_automatica())

        ttk.Label(form, text="Digite o Valor").grid(row=2, column=0, padx=10, pady=10)

        self.entry_venda_input = ttk.Entry(form, width=30)
        self.entry_venda_input.grid(row=2, column=1, padx=10, pady=10, sticky="w")
        self.entry_venda_input.bind("<KeyRelease>", lambda e: self.calcular_venda_automatica())

        self.lbl_preview = ttk.Label(form, text="0 g | R$ 0,00", font=("Segoe UI", 11, "bold"))
        self.lbl_preview.grid(row=3, column=0, columnspan=2, pady=10)

        ttk.Button(form, text="Adicionar ao Carrinho", command=self.adicionar_ao_carrinho).grid(
            row=4,
            column=0,
            columnspan=2,
            pady=10
        )

        self.tree_carrinho = ttk.Treeview(
            frame,
            columns=("Produto", "Gramas", "Preço", "Subtotal"),
            show="headings"
        )

        for col in ("Produto", "Gramas", "Preço", "Subtotal"):
            self.tree_carrinho.heading(col, text=col)

        self.tree_carrinho.pack(fill="both", expand=True, pady=10)

        footer = ttk.Frame(frame)
        footer.pack(pady=10)

        ttk.Label(footer, text="Tipo").pack(side="left", padx=5)

        self.combo_tipo_venda = ttk.Combobox(footer, values=["avista", "fiado"], state="readonly", width=10)
        self.combo_tipo_venda.set("avista")
        self.combo_tipo_venda.pack(side="left", padx=5)

        ttk.Label(footer, text="Valor Pago").pack(side="left", padx=5)

        self.entry_valor_pago = ttk.Entry(footer, width=15)
        self.entry_valor_pago.insert(0, "0")
        self.entry_valor_pago.pack(side="left", padx=5)

        self.lbl_total = ttk.Label(frame, text="Total: R$ 0,00", font=("Segoe UI", 13, "bold"))
        self.lbl_total.pack(pady=10)

        ttk.Button(frame, text="Finalizar Venda", command=self.finalizar_venda).pack(pady=10)

        self.carregar_combo_produtos()

    def carregar_combo_produtos(self):
        self.produtos_cache = listar_produtos()

        valores = []

        for p in self.produtos_cache:
            valores.append(f"{p[0]} - {p[1]} - {self.formatar_moeda(p[4])}")

        self.combo_produtos["values"] = valores

    def calcular_venda_automatica(self):
        try:
            produto_texto = self.combo_produtos.get()

            if not produto_texto:
                return

            produto_id = int(produto_texto.split(" - ")[0])
            produto = next((p for p in self.produtos_cache if p[0] == produto_id), None)

            if not produto:
                return

            preco = float(produto[4])
            valor_digitado = self.entry_venda_input.get()

            if not valor_digitado:
                self.lbl_preview.config(text="0 g | R$ 0,00")
                return

            valor = self.moeda_para_float(valor_digitado)
            modo = self.combo_modo_venda.get()

            if modo == "Gramas":
                gramas = valor
                total = gramas * preco
            else:
                total = valor
                gramas = total / preco

            self.lbl_preview.config(text=f"{self.formatar_gramas(gramas)} | {self.formatar_moeda(total)}")

        except Exception:
            self.lbl_preview.config(text="Valor inválido")

    def adicionar_ao_carrinho(self):
        try:
            produto_texto = self.combo_produtos.get()

            if not produto_texto:
                return

            produto_id = int(produto_texto.split(" - ")[0])
            produto = next((p for p in self.produtos_cache if p[0] == produto_id), None)

            if not produto:
                return

            nome = produto[1]
            preco = float(produto[4])
            estoque = float(produto[5])
            valor = self.moeda_para_float(self.entry_venda_input.get())
            modo = self.combo_modo_venda.get()

            if modo == "Gramas":
                gramas = valor
                subtotal = gramas * preco
            else:
                subtotal = valor
                gramas = subtotal / preco

            if gramas <= 0:
                messagebox.showerror("Erro", "Quantidade precisa ser maior que zero")
                return

            if gramas > estoque:
                messagebox.showerror("Erro", "Estoque insuficiente")
                return

            self.carrinho.append((produto_id, gramas))

            self.tree_carrinho.insert(
                "",
                "end",
                values=(
                    nome,
                    self.formatar_gramas(gramas),
                    self.formatar_moeda(preco),
                    self.formatar_moeda(subtotal)
                )
            )

            self.entry_venda_input.delete(0, "end")
            self.lbl_preview.config(text="0 g | R$ 0,00")
            self.atualizar_total()

        except Exception as e:
            messagebox.showerror("Erro", str(e))

    def atualizar_total(self):
        total = 0

        for item in self.tree_carrinho.get_children():
            valores = self.tree_carrinho.item(item)["values"]
            total += self.texto_moeda_para_float(valores[3])

        self.lbl_total.config(text=f"Total: {self.formatar_moeda(total)}")

    def finalizar_venda(self):
        if not self.carrinho:
            messagebox.showwarning("Aviso", "Carrinho vazio")
            return

        try:
            tipo = self.combo_tipo_venda.get()
            valor_pago = self.moeda_para_float(self.entry_valor_pago.get())

            registrar_venda(self.carrinho, None, tipo, valor_pago)

            self.carrinho = []

            for item in self.tree_carrinho.get_children():
                self.tree_carrinho.delete(item)

            self.entry_valor_pago.delete(0, "end")
            self.entry_valor_pago.insert(0, "0")

            self.atualizar_total()
            self.carregar_produtos()
            self.carregar_combo_produtos()
            self.carregar_historico()
            self.atualizar_resumo()

            messagebox.showinfo("Sucesso", "Venda registrada")

        except Exception as e:
            messagebox.showerror("Erro", str(e))

    # =========================
    # CLIENTES
    # =========================

    def criar_aba_clientes(self):
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="Clientes")

        self.tree_clientes = ttk.Treeview(
            frame,
            columns=("ID", "Nome", "Telefone", "Limite", "Saldo"),
            show="headings"
        )

        for col in ("ID", "Nome", "Telefone", "Limite", "Saldo"):
            self.tree_clientes.heading(col, text=col)

        self.tree_clientes.pack(fill="both", expand=True, pady=10)

        botoes = ttk.Frame(frame)
        botoes.pack(pady=10)

        ttk.Button(botoes, text="Adicionar Cliente", command=self.adicionar_cliente_janela).pack(side="left", padx=5)
        ttk.Button(botoes, text="Editar", command=self.editar_cliente_janela).pack(side="left", padx=5)
        ttk.Button(botoes, text="Excluir", command=self.excluir_cliente).pack(side="left", padx=5)
        ttk.Button(botoes, text="Atualizar", command=self.carregar_clientes).pack(side="left", padx=5)

        self.carregar_clientes()

    def carregar_clientes(self):
        for item in self.tree_clientes.get_children():
            self.tree_clientes.delete(item)

        for c in listar_clientes():
            self.tree_clientes.insert(
                "",
                "end",
                values=(
                    c[0],
                    c[1],
                    c[2],
                    self.formatar_moeda(c[4]),
                    self.formatar_moeda(c[5])
                )
            )

    def adicionar_cliente_janela(self):
        self.janela_cliente("Adicionar Cliente", None)

    def editar_cliente_janela(self):
        selecionado = self.tree_clientes.selection()

        if not selecionado:
            return

        id_cliente = self.tree_clientes.item(selecionado[0])["values"][0]
        cliente = next((c for c in listar_clientes() if c[0] == id_cliente), None)

        if cliente:
            self.janela_cliente("Editar Cliente", cliente)

    def janela_cliente(self, titulo, cliente):
        win = tk.Toplevel(self.root)
        win.title(titulo)
        win.geometry("400x300")
        win.configure(bg="#f3f4f6")

        campos = ["Nome", "Telefone", "Endereço", "Limite"]
        entries = {}

        for i, campo in enumerate(campos):
            ttk.Label(win, text=campo).grid(row=i, column=0, padx=10, pady=10)

            e = ttk.Entry(win, width=30)
            e.grid(row=i, column=1, padx=10, pady=10)

            entries[campo] = e

        if cliente:
            entries["Nome"].insert(0, cliente[1])
            entries["Telefone"].insert(0, cliente[2] or "")
            entries["Endereço"].insert(0, cliente[3] or "")
            entries["Limite"].insert(0, str(cliente[4]).replace(".", ","))

        def salvar():
            try:
                nome = entries["Nome"].get()
                telefone = entries["Telefone"].get()
                endereco = entries["Endereço"].get()
                limite = self.moeda_para_float(entries["Limite"].get())

                if cliente:
                    atualizar_cliente(cliente[0], nome, telefone, endereco, limite)
                else:
                    adicionar_cliente(nome, telefone, endereco, limite)

                self.carregar_clientes()
                win.destroy()

                messagebox.showinfo("Sucesso", "Cliente salvo")

            except Exception as e:
                messagebox.showerror("Erro", str(e))

        ttk.Button(
            win,
            text="Salvar Cliente",
            command=salvar
        ).grid(row=len(campos), column=0, columnspan=2, pady=20)

    def excluir_cliente(self):
        selecionado = self.tree_clientes.selection()

        if not selecionado:
            return

        id_cliente = self.tree_clientes.item(selecionado[0])["values"][0]

        if messagebox.askyesno("Confirmar", "Excluir cliente?"):
            deletar_cliente(id_cliente)
            self.carregar_clientes()

    # =========================
    # HISTÓRICO
    # =========================

    def criar_aba_historico(self):
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="Histórico")

        self.tree_historico = ttk.Treeview(
            frame,
            columns=("ID", "Data", "Cliente", "Tipo", "Total", "Pago", "Status"),
            show="headings"
        )

        for col in ("ID", "Data", "Cliente", "Tipo", "Total", "Pago", "Status"):
            self.tree_historico.heading(col, text=col)

        self.tree_historico.pack(fill="both", expand=True, pady=10)

        botoes = ttk.Frame(frame)
        botoes.pack(pady=10)

        ttk.Button(botoes, text="Ver Itens", command=self.ver_itens_venda).pack(side="left", padx=5)
        ttk.Button(botoes, text="Editar Venda", command=self.editar_venda).pack(side="left", padx=5)
        ttk.Button(botoes, text="Excluir Venda", command=self.excluir_venda_selecionada).pack(side="left", padx=5)
        ttk.Button(botoes, text="Atualizar", command=self.carregar_historico).pack(side="left", padx=5)

        self.carregar_historico()

    def carregar_historico(self):
        for item in self.tree_historico.get_children():
            self.tree_historico.delete(item)

        for v in listar_vendas():
            self.tree_historico.insert(
                "",
                "end",
                values=(
                    v[0],
                    self.formatar_data_brasil(v[1]),
                    v[2],
                    v[3],
                    self.formatar_moeda(v[4]),
                    self.formatar_moeda(v[5]),
                    v[6]
                )
            )

    def venda_selecionada_id(self):
        selecionado = self.tree_historico.selection()

        if not selecionado:
            messagebox.showwarning("Aviso", "Selecione uma venda")
            return None

        return self.tree_historico.item(selecionado[0])["values"][0]

    def ver_itens_venda(self):
        venda_id = self.venda_selecionada_id()

        if not venda_id:
            return

        itens = obter_itens_venda(venda_id)

        win = tk.Toplevel(self.root)
        win.title(f"Itens da Venda #{venda_id}")
        win.geometry("600x350")

        tree = ttk.Treeview(
            win,
            columns=("Produto", "Gramas", "Preço", "Subtotal"),
            show="headings"
        )

        for col in ("Produto", "Gramas", "Preço", "Subtotal"):
            tree.heading(col, text=col)

        tree.pack(fill="both", expand=True)

        for produto_id, nome, gramas, preco in itens:
            subtotal = gramas * preco
            tree.insert(
                "",
                "end",
                values=(
                    nome,
                    self.formatar_gramas(gramas),
                    self.formatar_moeda(preco),
                    self.formatar_moeda(subtotal)
                )
            )

    def excluir_venda_selecionada(self):
        venda_id = self.venda_selecionada_id()

        if not venda_id:
            return

        if messagebox.askyesno("Confirmar", "Excluir essa venda e devolver o estoque?"):
            excluir_venda(venda_id)

            self.carregar_historico()
            self.carregar_produtos()
            self.carregar_combo_produtos()
            self.atualizar_resumo()

            messagebox.showinfo("Sucesso", "Venda excluída e estoque devolvido")

    def editar_venda(self):
        venda_id = self.venda_selecionada_id()

        if not venda_id:
            return

        if not messagebox.askyesno(
            "Editar venda",
            "A venda será excluída, o estoque será devolvido e os itens voltarão para o carrinho. Depois finalize novamente."
        ):
            return

        itens = obter_itens_venda(venda_id)
        excluir_venda(venda_id)

        self.carrinho = []

        for item in self.tree_carrinho.get_children():
            self.tree_carrinho.delete(item)

        for produto_id, nome, gramas, preco in itens:
            subtotal = gramas * preco
            self.carrinho.append((produto_id, gramas))

            self.tree_carrinho.insert(
                "",
                "end",
                values=(
                    nome,
                    self.formatar_gramas(gramas),
                    self.formatar_moeda(preco),
                    self.formatar_moeda(subtotal)
                )
            )

        self.atualizar_total()
        self.carregar_historico()
        self.carregar_produtos()
        self.carregar_combo_produtos()
        self.atualizar_resumo()

        self.notebook.select(1)

    # =========================
    # BANCO / CAIXA
    # =========================

    def criar_aba_banco(self):
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="Banco/Caixa")

        topo = ttk.Frame(frame)
        topo.pack(fill="x", pady=15)

        ttk.Label(topo, text="Saldo inicial no banco").grid(row=0, column=0, padx=10, pady=5, sticky="w")

        self.entry_saldo_inicial = ttk.Entry(topo, width=20)
        self.entry_saldo_inicial.grid(row=0, column=1, padx=10, pady=5)

        ttk.Button(
            topo,
            text="Salvar Saldo Inicial",
            command=self.salvar_saldo_inicial_banco
        ).grid(row=0, column=2, padx=10, pady=5)

        ttk.Label(topo, text="Quanto tem no banco agora").grid(row=1, column=0, padx=10, pady=5, sticky="w")

        self.entry_saldo_atual = ttk.Entry(topo, width=20)
        self.entry_saldo_atual.grid(row=1, column=1, padx=10, pady=5)

        ttk.Button(
            topo,
            text="Salvar Saldo Atual",
            command=self.salvar_saldo_atual_banco
        ).grid(row=1, column=2, padx=10, pady=5)

        cards = ttk.Frame(frame)
        cards.pack(fill="x", pady=20)

        self.lbl_banco_saldo_inicial = ttk.Label(cards, text="Saldo inicial: R$ 0,00", font=("Segoe UI", 13, "bold"))
        self.lbl_banco_saldo_inicial.pack(anchor="w", padx=10, pady=5)

        self.lbl_banco_saldo_esperado = ttk.Label(cards, text="Saldo esperado: R$ 0,00", font=("Segoe UI", 13, "bold"))
        self.lbl_banco_saldo_esperado.pack(anchor="w", padx=10, pady=5)

        self.lbl_banco_saldo_atual = ttk.Label(cards, text="Saldo informado: R$ 0,00", font=("Segoe UI", 13, "bold"))
        self.lbl_banco_saldo_atual.pack(anchor="w", padx=10, pady=5)

        self.lbl_banco_diferenca = ttk.Label(cards, text="Diferença: R$ 0,00", font=("Segoe UI", 13, "bold"))
        self.lbl_banco_diferenca.pack(anchor="w", padx=10, pady=5)

        ttk.Label(frame, text="Movimentações automáticas", font=("Segoe UI", 12, "bold")).pack(
            anchor="w",
            padx=10,
            pady=(20, 5)
        )

        self.tree_banco = ttk.Treeview(
            frame,
            columns=("ID", "Data", "Descrição", "Tipo", "Valor"),
            show="headings"
        )

        for col in ("ID", "Data", "Descrição", "Tipo", "Valor"):
            self.tree_banco.heading(col, text=col)

        self.tree_banco.column("ID", width=60)
        self.tree_banco.column("Data", width=170)
        self.tree_banco.column("Descrição", width=400)
        self.tree_banco.column("Tipo", width=100)
        self.tree_banco.column("Valor", width=120)

        self.tree_banco.pack(fill="both", expand=True, padx=10, pady=10)

        ttk.Button(
            frame,
            text="Atualizar Banco/Caixa",
            command=self.atualizar_banco
        ).pack(pady=10)

        self.atualizar_banco()

    def salvar_saldo_inicial_banco(self):
        try:
            valor = self.moeda_para_float(self.entry_saldo_inicial.get())
            set_banco_config("saldo_inicial", valor)

            self.atualizar_banco()

            messagebox.showinfo("Sucesso", "Saldo inicial salvo com sucesso")

        except Exception as e:
            messagebox.showerror("Erro", str(e))

    def salvar_saldo_atual_banco(self):
        try:
            valor = self.moeda_para_float(self.entry_saldo_atual.get())
            set_banco_config("saldo_atual_informado", valor)

            self.atualizar_banco()

            messagebox.showinfo("Sucesso", "Saldo atual informado salvo com sucesso")

        except Exception as e:
            messagebox.showerror("Erro", str(e))

    def atualizar_banco(self):
        saldo_inicial = get_banco_config("saldo_inicial")
        saldo_atual_informado = get_banco_config("saldo_atual_informado")
        esperado = saldo_banco_esperado()
        diferenca = saldo_atual_informado - esperado

        if hasattr(self, "entry_saldo_inicial"):
            self.entry_saldo_inicial.delete(0, "end")
            self.entry_saldo_inicial.insert(0, str(saldo_inicial).replace(".", ","))

        if hasattr(self, "entry_saldo_atual"):
            self.entry_saldo_atual.delete(0, "end")
            self.entry_saldo_atual.insert(0, str(saldo_atual_informado).replace(".", ","))

        if hasattr(self, "lbl_banco_saldo_inicial"):
            self.lbl_banco_saldo_inicial.config(
                text=f"Saldo inicial: {self.formatar_moeda(saldo_inicial)}"
            )

            self.lbl_banco_saldo_esperado.config(
                text=f"Saldo esperado pelo sistema: {self.formatar_moeda(esperado)}"
            )

            self.lbl_banco_saldo_atual.config(
                text=f"Saldo informado no banco: {self.formatar_moeda(saldo_atual_informado)}"
            )

            self.lbl_banco_diferenca.config(
                text=f"Diferença: {self.formatar_moeda(diferenca)}"
            )

        if hasattr(self, "tree_banco"):
            for item in self.tree_banco.get_children():
                self.tree_banco.delete(item)

            for movimento in listar_movimentos_banco():
                movimento_id = movimento[0]
                data = movimento[1]
                descricao = movimento[2]
                tipo = movimento[3]
                valor = movimento[4]

                self.tree_banco.insert(
                    "",
                    "end",
                    values=(
                        movimento_id,
                        self.formatar_data_brasil(data),
                        descricao,
                        tipo,
                        self.formatar_moeda(valor)
                    )
                )

    # =========================
    # RELATÓRIOS
    # =========================

    def criar_aba_relatorios(self):
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="Relatórios")

        self.lbl_resumo = ttk.Label(frame, text="", font=("Segoe UI", 13, "bold"))
        self.lbl_resumo.pack(pady=20)

        self.tree_gastos = ttk.Treeview(
            frame,
            columns=("Produto", "Gramas Compradas", "Total Gasto"),
            show="headings"
        )

        for col in ("Produto", "Gramas Compradas", "Total Gasto"):
            self.tree_gastos.heading(col, text=col)

        self.tree_gastos.pack(fill="both", expand=True, pady=10)

    # =========================
    # FIADO
    # =========================

    def criar_aba_fiado(self):
        frame = ttk.Frame(self.notebook)
        self.notebook.add(frame, text="Fiado")

        self.lbl_fiado = ttk.Label(frame, text="R$ 0,00", font=("Segoe UI", 18, "bold"))
        self.lbl_fiado.pack(pady=40)

    # =========================
    # RESUMO
    # =========================

    def atualizar_resumo(self):
        hoje = date.today().strftime("%Y-%m-%d")

        bruto, liquido = faturamento_bruto_liquido(hoje, hoje)
        gasto = total_gasto_estoque()

        self.lbl_resumo.config(
            text=
            f"Bruto hoje: {self.formatar_moeda(bruto)}\n"
            f"Líquido hoje: {self.formatar_moeda(liquido)}\n"
            f"Gasto Estoque: {self.formatar_moeda(gasto)}"
        )

        self.lbl_fiado.config(text=self.formatar_moeda(get_total_fiado()))

        for item in self.tree_gastos.get_children():
            self.tree_gastos.delete(item)

        for nome, quantidade, custo in gasto_por_produto():
            self.tree_gastos.insert(
                "",
                "end",
                values=(
                    nome,
                    self.formatar_gramas(quantidade),
                    self.formatar_moeda(custo)
                )
            )

        if hasattr(self, "tree_banco"):
            self.atualizar_banco()


if __name__ == "__main__":
    init_db()

    login_root = tk.Tk()
    LoginWindow(login_root)
    login_root.mainloop()