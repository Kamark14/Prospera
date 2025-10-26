const Transacao = require('../models/Transacao');
const Categoria = require('../models/Categoria');

exports.criarTransacao = async (req, res) => {
  try {
    const { descricao, valor, data, tipo, categoria_id } = req.body;
    const usuario_id = req.usuario.id;

    const transacao = await Transacao.create({
      descricao,
      valor,
      data,
      tipo,
      categoria_id,
      usuario_id
    });

    res.status(201).json(transacao);
  } catch (error) {
    res.status(400).json({ erro: error.message });
  }
};

exports.listarTransacoes = async (req, res) => {
  try {
    const { mes, ano } = req.query;
    const usuario_id = req.usuario.id;

    let where = { usuario_id };
    
    if (mes && ano) {
      where.data = {
        [Op.and]: [
          Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('data')), mes),
          Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('data')), ano)
        ]
      };
    }

    const transacoes = await Transacao.findAll({
      where,
      include: [{ model: Categoria, attributes: ['nome'] }],
      order: [['data', 'DESC']]
    });

    res.json(transacoes);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
};
