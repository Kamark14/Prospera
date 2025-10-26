import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { Circle, G, Text as SvgText } from 'react-native-svg';
import { formatCurrency } from '../formatCurrency';

const RADIUS = 80; // Aumentado para gráfico maior
const STROKE_WIDTH = 22; // Aumentado
const SIZE = (RADIUS + STROKE_WIDTH / 2) * 2;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Componente PieChart (Donut Chart) - MELHORADO
export const PieChart = ({ data, total, title, onAddData }) => {
  if (data.length === 0 || total === 0) {
    return (
      <View style={styles.emptyChartCard}>
        <Text style={styles.emptyChartTitle}>{title}</Text>
        <View style={styles.emptyChartContent}>
          <Text style={styles.emptyChartText}>Nenhum dado disponível</Text>
          <Text style={styles.emptyChartSubtext}>
            {title.includes('Receitas') ? 'Adicione sua primeira receita' : 'Adicione seu primeiro gasto'}
          </Text>
          {onAddData && (
            <TouchableOpacity style={styles.addButton} onPress={onAddData}>
              <Text style={styles.addButtonText}>
                {title.includes('Receitas') ? 'ADICIONAR RECEITA' : 'ADICIONAR GASTO'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  let startAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = item.amount / total;
    const strokeDashoffset = CIRCUMFERENCE * (1 - percentage);
    const rotation = startAngle;

    startAngle += percentage * 360;

    return {
      key: index,
      color: item.color,
      strokeDashoffset,
      rotation,
      percentage: percentage * 100,
      name: item.name,
      amount: item.amount,
    };
  });

  return (
    <View style={styles.chartCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.chartContent}>
        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
          <G x={CENTER} y={CENTER} rotation={-90}>
            {/* Fundo cinza para contraste */}
            <Circle
              r={RADIUS}
              cx="0"
              cy="0"
              fill="transparent"
              stroke="#f0f0f0"
              strokeWidth={STROKE_WIDTH}
            />
            {segments.map((segment) => (
              <Circle
                key={segment.key}
                r={RADIUS}
                cx="0"
                cy="0"
                fill="transparent"
                stroke={segment.color}
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={segment.strokeDashoffset}
                rotation={segment.rotation}
                origin="0, 0"
                strokeLinecap="round"
              />
            ))}
          </G>
          <SvgText
            x={CENTER}
            y={CENTER - 12}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="18"
            fontWeight="bold"
            fill="#333"
          >
            {formatCurrency(total)}
          </SvgText>
          <SvgText
            x={CENTER}
            y={CENTER + 18}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="14"
            fill="#666"
          >
            Total
          </SvgText>
        </Svg>
        <View style={styles.legendContainer}>
          {segments.map((segment) => (
            <View key={segment.key} style={styles.legendItem}>
              <View style={styles.legendLeft}>
                <View style={[styles.colorBox, { backgroundColor: segment.color }]} />
                <View style={styles.legendTextContainer}>
                  <Text style={styles.legendLabel} numberOfLines={2}>
                    {segment.name}
                  </Text>
                </View>
              </View>
              <View style={styles.legendRight}>
                <Text style={styles.legendValue}>{formatCurrency(segment.amount)}</Text>
                <Text style={styles.legendPercentage}>{segment.percentage.toFixed(1)}%</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

// Componente SimpleChart (Barra Horizontal para Dashboard) - MELHORADO
export const SimpleChart = ({ data, title, onAddData }) => {
  const filteredData = data.filter(item => item.amount > 0);
  
  if (filteredData.length === 0) {
    return (
      <View style={styles.emptyChartCard}>
        <Text style={styles.emptyChartTitle}>{title}</Text>
        <View style={styles.emptyChartContent}>
          <Text style={styles.emptyChartText}>Nenhum dado disponível</Text>
          <Text style={styles.emptyChartSubtext}>
            {title.includes('Receitas') ? 'Adicione receitas para ver o gráfico' : 'Adicione gastos para ver o gráfico'}
          </Text>
          {onAddData && (
            <TouchableOpacity style={styles.addButton} onPress={onAddData}>
              <Text style={styles.addButtonText}>
                {title.includes('Receitas') ? 'ADICIONAR RECEITA' : 'ADICIONAR GASTO'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  const total = filteredData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <View style={styles.simpleChartCard}>
      <Text style={styles.cardTitle}>{title}</Text>
      <View style={styles.simpleChartContent}>
        {filteredData.map((item, index) => {
          const percentage = (item.amount / total) * 100;
          return (
            <View key={index} style={styles.simpleChartItem}>
              <View style={styles.simpleChartHeader}>
                <View style={styles.simpleChartLegend}>
                  <View style={[styles.colorBox, { backgroundColor: item.color }]} />
                  <View style={styles.simpleChartTextContainer}>
                    <Text style={styles.simpleChartLabel} numberOfLines={2}>
                      {item.name}
                    </Text>
                  </View>
                </View>
                <View style={styles.simpleChartValues}>
                  <Text style={styles.simpleChartAmount}>{formatCurrency(item.amount)}</Text>
                  <Text style={styles.simpleChartPercentage}>{percentage.toFixed(1)}%</Text>
                </View>
              </View>
              <View style={styles.simpleChartBarContainer}>
                <View style={styles.simpleChartBar}>
                  <View 
                    style={[
                      styles.simpleChartSegment,
                      { 
                        backgroundColor: item.color,
                        width: `${percentage}%`
                      }
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24, // Aumentado
    marginBottom: 20, // Aumentado
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 320, // Altura mínima para garantir espaço
  },
  cardTitle: {
    fontSize: 20, // Aumentado
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20, // Aumentado
  },
  chartContent: {
    flexDirection: 'row',
    alignItems: 'flex-start', // Alinhar ao topo
    justifyContent: 'space-between',
  },
  legendContainer: {
    flex: 1,
    paddingLeft: 20, // Aumentado
    minHeight: 200, // Altura mínima para legenda
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16, // Aumentado
    paddingVertical: 8, // Aumentado
    minHeight: 50, // Altura mínima por item
  },
  legendLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  legendTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  legendRight: {
    alignItems: 'flex-end',
    minWidth: 90, // Aumentado
  },
  colorBox: {
    width: 20, // Aumentado
    height: 20, // Aumentado
    borderRadius: 6, // Aumentado
    marginRight: 16, // Aumentado
  },
  legendLabel: {
    fontSize: 16, // Aumentado
    color: '#333',
    fontWeight: '500',
    flex: 1,
    lineHeight: 20, // Melhor espaçamento
  },
  legendValue: {
    fontSize: 16, // Aumentado
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  legendPercentage: {
    fontSize: 14, // Aumentado
    color: '#666',
    fontWeight: '500',
  },
  emptyChartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32, // Aumentado
    marginBottom: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 200,
  },
  emptyChartTitle: {
    fontSize: 20, // Aumentado
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyChartContent: {
    alignItems: 'center',
  },
  emptyChartText: {
    fontSize: 18, // Aumentado
    color: '#666',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyChartSubtext: {
    fontSize: 16, // Aumentado
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#003366',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16, // Aumentado
    fontWeight: 'bold',
  },
  // Estilos para SimpleChart
  simpleChartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    minHeight: 200,
  },
  simpleChartContent: {
    width: '100%',
  },
  simpleChartItem: {
    marginBottom: 20, // Aumentado
    minHeight: 60, // Altura mínima por item
  },
  simpleChartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', // Alinhar ao topo
    marginBottom: 12,
  },
  simpleChartLegend: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: 16,
  },
  simpleChartTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  simpleChartLabel: {
    fontSize: 16, // Aumentado
    fontWeight: '500',
    color: '#333',
    flex: 1,
    lineHeight: 20,
  },
  simpleChartValues: {
    alignItems: 'flex-end',
    minWidth: 90, // Aumentado
  },
  simpleChartAmount: {
    fontSize: 16, // Aumentado
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  simpleChartPercentage: {
    fontSize: 14, // Aumentado
    color: '#666',
    fontWeight: '500',
  },
  simpleChartBarContainer: {
    width: '100%',
    marginTop: 8,
  },
  simpleChartBar: {
    height: 12, // Aumentado
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    overflow: 'hidden',
  },
  simpleChartSegment: {
    height: '100%',
    borderRadius: 6,
  },
});