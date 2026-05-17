// components/pdf/LaporanPDF.tsx
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    fontSize: 10,
    fontFamily: 'Helvetica'
  },
  header: { 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  subtitle: { 
    fontSize: 12, 
    color: '#666', 
    marginBottom: 10 
  },
  table: { 
    marginTop: 10,
    width: '100%'
  },
  tableRow: { 
    flexDirection: 'row', 
    borderBottomWidth: 1, 
    borderBottomColor: '#ddd', 
    paddingVertical: 5 
  },
  tableHeader: { 
    backgroundColor: '#f0f0f0', 
    fontWeight: 'bold' 
  },
  tableCell: { 
    flex: 1, 
    paddingHorizontal: 5 
  },
  summary: { 
    marginTop: 20, 
    padding: 10, 
    backgroundColor: '#f5f5f5' 
  },
  summaryRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 5 
  },
  footer: { 
    marginTop: 30, 
    textAlign: 'center', 
    color: '#999', 
    fontSize: 8 
  }
})

interface LaporanPDFProps {
  data: any[]
  summary: any
  bulan: string
  tahun: string
  status: string
}

export default function LaporanPDF({ data, summary, bulan, tahun, status }: LaporanPDFProps) {
  const statusText = status === 'all' ? 'Semua' : status === 'lunas' ? 'Lunas' : 'Belum Lunas'
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>LAPORAN KAS KELUARGA</Text>
          <Text style={styles.subtitle}>Periode: {bulan} {tahun}</Text>
          <Text style={styles.subtitle}>Status: {statusText}</Text>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Total Tagihan:</Text>
            <Text>Rp {summary.totalTagihan.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Sudah Lunas:</Text>
            <Text>Rp {summary.totalLunas.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Belum Lunas:</Text>
            <Text>Rp {summary.totalBelumLunas.toLocaleString('id-ID')}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Tingkat Ketertiban:</Text>
            <Text>{summary.persentase.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>No</Text>
          <Text style={[styles.tableCell, { flex: 2 }]}>Keluarga</Text>
          <Text style={styles.tableCell}>Bulan</Text>
          <Text style={styles.tableCell}>Nominal</Text>
          <Text style={styles.tableCell}>Status</Text>
        </View>
        
        {/* Table Body */}
        {data.map((item, index) => (
          <View key={item.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{index + 1}</Text>
            <Text style={[styles.tableCell, { flex: 2 }]}>{item.keluarga?.namaKeluarga}</Text>
            <Text style={styles.tableCell}>{item.bulan}</Text>
            <Text style={styles.tableCell}>Rp {item.nominal.toLocaleString('id-ID')}</Text>
            <Text style={styles.tableCell}>
              {item.status === 'lunas' ? 'LUNAS' : 'BELUM LUNAS'}
            </Text>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Dicetak: {new Date().toLocaleString('id-ID')}</Text>
          <Text>Sistem Kas Keluarga</Text>
        </View>
      </Page>
    </Document>
  )
}