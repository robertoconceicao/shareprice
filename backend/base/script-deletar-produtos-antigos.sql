delete from produto 
where 
DATEDIFF(curdate(), date(dtpublicacao)) > 4;