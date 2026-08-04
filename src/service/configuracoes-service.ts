import Configuracoes from "@/models/configuracoes-model";
const defaults={nomeLoja:"Minha Loja",descricao:"",numeroLoja:"",chavePix:"",titularPix:"",valorFrete:0,pedidoMinimo:null,slugCardapio:"cardapio",prazoEntrega:"30-45 min",horarioFuncionamento:"Todos os dias",aberto:true,corPrimaria:"#ea580c",capaUrl:""};
export class ConfiguracoesService {async obter(){const [c]=await Configuracoes.findOrCreate({where:{id:1},defaults:{id:1,...defaults} as any});return c;}async salvar(d:any){const c=await this.obter();await c.update(d);return c;}}
export default new ConfiguracoesService();
